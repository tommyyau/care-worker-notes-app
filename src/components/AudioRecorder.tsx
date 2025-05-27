import { useState, useRef, useEffect } from 'react';

interface AudioRecorderProps {
  onTranscriptionComplete: (transcript: string) => void;
  disabled?: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onTranscriptionComplete, 
  disabled = false 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      // Enhanced audio constraints for better quality
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 44100,
          sampleSize: 16
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Try formats in order of preference for iOS Safari compatibility
      let mimeType;
      if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/wav')) {
        mimeType = 'audio/wav';
      } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else {
        // If none of the preferred formats are supported, try basic formats
        const supportedMimeTypes = [
          'audio/webm',
          'audio/ogg',
          'audio/mpeg',
          'audio/m4a',
          'audio/mp3'
        ];
        
        for (const type of supportedMimeTypes) {
          if (MediaRecorder.isTypeSupported(type)) {
            mimeType = type;
            break;
          }
        }
        
        if (!mimeType) {
          throw new Error('No supported audio format found on this browser');
        }
      }

      console.log('Using audio format:', mimeType); // Debug log
      
      const options = {
        mimeType,
        audioBitsPerSecond: 128000
      };

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Convert to WAV format for better compatibility
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mediaRecorder.mimeType 
        });
        
        try {
          await transcribeAudio(audioBlob);
        } catch (error) {
          console.error('Transcription error:', error);
          alert('Failed to transcribe audio. Please try speaking more clearly or check your connection.');
        }
        
        // Clean up the stream
        stream.getTracks().forEach(track => track.stop());
      };

      // Request data more frequently on mobile
      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        alert('Microphone access denied. Please enable microphone permissions in your browser settings.');
      } else {
        alert('Failed to start recording. Please check your microphone and try again.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const { openaiService } = await import('../services/openai');
      const transcript = await openaiService.transcribeAudio(audioBlob);
      if (!transcript) {
        throw new Error('No transcription received');
      }
      onTranscriptionComplete(transcript);
    } catch (error) {
      console.error('Transcription error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to transcribe audio';
      alert(`Transcription failed: ${errorMessage}. Please try again.`);
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Recording Mode Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Recording Mode</h3>
          <p className="text-sm text-gray-500">Tap to start/stop recording</p>
        </div>
        
        {/* Timer Display */}
        <div className="text-right">
          <div className="text-lg font-mono text-gray-900">
            {formatTime(recordingTime)}
          </div>
        </div>
      </div>

      {/* Recording Button */}
      <div className="flex justify-center">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={disabled || isTranscribing}
            className="w-16 h-16 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors shadow-lg"
          >
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg animate-pulse"
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Tips Section */}
      {!isRecording && !isTranscribing && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Tips:</strong> Speak clearly and at a normal pace. Include key observations about the patient's condition and your care activities.
          </p>
        </div>
      )}

      {/* Status Messages */}
      {isTranscribing && (
        <div className="flex items-center justify-center text-blue-600 py-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-sm">Transcribing audio...</span>
        </div>
      )}

      {disabled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Please configure your OpenAI API key to use audio recording.
          </p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder; 