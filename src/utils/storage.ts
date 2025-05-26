import type { CareNote } from '../types';

const STORAGE_KEY = 'care-notes';

export const storageUtils = {
  // Save a note to localStorage
  saveNote: (note: CareNote): void => {
    const notes = storageUtils.getNotes();
    const existingIndex = notes.findIndex(n => n.id === note.id);
    
    if (existingIndex >= 0) {
      notes[existingIndex] = { ...note, updatedAt: new Date().toISOString() };
    } else {
      notes.push(note);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  },

  // Get all notes from localStorage
  getNotes: (): CareNote[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing notes from localStorage:', error);
      return [];
    }
  },

  // Get a specific note by ID
  getNoteById: (id: string): CareNote | undefined => {
    const notes = storageUtils.getNotes();
    return notes.find(note => note.id === id);
  },

  // Delete a note by ID
  deleteNote: (id: string): void => {
    const notes = storageUtils.getNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes));
  },

  // Clear all notes
  clearAllNotes: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Export notes as JSON
  exportNotes: (): string => {
    const notes = storageUtils.getNotes();
    return JSON.stringify(notes, null, 2);
  },

  // Import notes from JSON
  importNotes: (jsonData: string): boolean => {
    try {
      const notes = JSON.parse(jsonData) as CareNote[];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      return true;
    } catch (error) {
      console.error('Error importing notes:', error);
      return false;
    }
  }
};

// Utility function to generate unique IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Utility function to format date and time
export const formatDateTime = (date: Date = new Date()) => {
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    iso: date.toISOString()
  };
}; 