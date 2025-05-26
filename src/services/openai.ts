import OpenAI from 'openai';
import type { EnhancedNote, VisitType, TranscriptionResult } from '../types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled via a backend
});

export const openaiService = {
  // Transcribe audio using Whisper with automatic translation to English
  transcribeAudio: async (audioBlob: Blob): Promise<string> => {
    try {
      // Create a more descriptive filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const file = new File([audioBlob], `audio-${timestamp}.webm`, { 
        type: audioBlob.type 
      });
      
      // Add retry logic for better reliability
      let retries = 3;
      let lastError: Error | null = null;
      
      while (retries > 0) {
        try {
          console.log('Attempting transcription, attempt', 4 - retries);
          // Always translate to English
          const response = await openai.audio.translations.create({
            file,
            model: 'whisper-1'
          });

          console.log('Transcription successful:', response);
          return typeof response === 'string' ? response : response.text;
        } catch (error) {
          console.error('Transcription attempt failed:', error);
          lastError = error as Error;
          retries--;
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      throw lastError || new Error('Failed to transcribe after multiple attempts');
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  },

  // Enhance notes using GPT-4o
  enhanceNotes: async (rawContent: string, visitType: VisitType = 'standard'): Promise<EnhancedNote> => {
    try {
      // Create visit type specific context
      const visitTypeContext = visitType === 'medication' 
        ? 'This is a medication management visit. Focus on medication adherence, side effects, and patient understanding.'
        : visitType === 'therapy'
        ? 'This is a therapy visit. Focus on therapeutic activities, patient engagement, and progress towards goals.'
        : 'This is a standard care visit. Focus on overall wellbeing, daily activities, and general care needs.';

      const prompt = `You are a professional care worker assistant. Transform the following rough care notes into a professional, standardized care visit report.
Maintain the human touch and empathy while improving language, clarity, and structure. DO NOT INCLUDE ANY INFORMATON THAT WAS NOT PROVIDED IN THE RAW NOTES.

${visitTypeContext}

Raw care worker notes: "${rawContent}"

IMPORTANT: Respond with ONLY a valid JSON object. Do not include any markdown formatting, explanations, or additional text.

Format the output as a JSON object with the following structure:
{
  "patientName": "Extract or infer the patient name from the notes. Use a generic name if not mentioned.",
  "patientStatus": "<ul><li>First observation</li><li>Second observation</li></ul>",
  "careProvided": {
    "activitiesCompleted": "<ul><li>First activity</li><li>Second activity</li></ul>",
    "patientResponse": "<ul><li>First response</li><li>Second response</li></ul>"
  },
  "personalConnectionHighlights": "<ul><li>First highlight</li><li>Second highlight</li></ul>",
  "areasOfConcern": "<ul><li>First concern</li><li>Second concern</li></ul>",
  "carePlanAdherence": "<ul><li>First adherence note</li><li>Second adherence note</li></ul>",
  "nextVisitPreparations": "<ul><li>First preparation</li><li>Second preparation</li></ul>"
}

Visit type: ${visitType.charAt(0).toUpperCase() + visitType.slice(1)} Care Visit Report

Formatting Instructions:
- Use bullet point lists with <ul> and <li> tags
- Highlight important observations with: <span class='bg-green-50 text-green-800 px-1 rounded'>important text</span>
- Maintain human touch and personal elements
- Ensure professional language while preserving empathy
- Do not include any information that was not provided in the raw notes, if not available, indicate N/A
- Return ONLY the JSON object, no other text`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Clean the response content - remove any markdown formatting
      let cleanContent = content.trim();
      
      // Remove markdown code blocks if present
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Try to find JSON content if it's wrapped in other text
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanContent = jsonMatch[0];
      }

      console.log('Attempting to parse:', cleanContent);

      // Parse the JSON response
      const enhancedNote = JSON.parse(cleanContent) as EnhancedNote;
      return enhancedNote;
    } catch (error) {
      console.error('Error enhancing notes:', error);
      
      if (error instanceof SyntaxError) {
        throw new Error(`Failed to parse enhanced notes. The AI response was not in the expected format. Please try again.`);
      }
      throw new Error('Failed to enhance notes. Please check your API key and try again.');
    }
  }
};

// Utility function to check if API key is configured
export const isApiKeyConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  return apiKey && apiKey !== 'your_openai_api_key_here';
}; 