// Core data structures for the Care Notes application

export interface PatientStatus {
  physicalCondition: string;
  mentalEmotionalState: string;
}

export interface CareProvided {
  activitiesCompleted: string;
  patientResponse: string;
}

export interface EnhancedNote {
  patientName: string;
  patientStatus: string; // Changed to single string with HTML content
  careProvided: CareProvided;
  personalConnectionHighlights: string;
  areasOfConcern: string;
  carePlanAdherence: string;
  nextVisitPreparations: string;
}

export interface CareNote {
  id: string;
  date: string;
  time: string;
  careWorker: string;
  patient: string;
  patientId: string;
  visitType: string;
  rawContent: string;
  enhancedContent?: EnhancedNote;
  templateType: string;
  createdAt: string;
  updatedAt: string;
}

export type VisitType = 'standard' | 'medication' | 'therapy';

export interface AudioRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  audioBlob?: Blob;
  duration: number;
}

export interface TranscriptionState {
  isTranscribing: boolean;
  transcript: string;
  error?: string;
}

export interface EnhancementState {
  isEnhancing: boolean;
  enhancedNote?: EnhancedNote;
  error?: string;
}

export interface TranscriptionResult {
  text: string;
  detectedLanguage: string;
  translation?: string;
} 