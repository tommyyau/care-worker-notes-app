import React from 'react';
import type { EnhancedNote } from '../types';

interface EnhancementPanelProps {
  enhancedNote: EnhancedNote | null;
  isEnhancing: boolean;
}

const EnhancementPanel: React.FC<EnhancementPanelProps> = ({ 
  enhancedNote, 
  isEnhancing 
}) => {
  if (isEnhancing) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Enhanced Notes</h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Enhancing your notes...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
          </div>
        </div>
      </div>
    );
  }

  if (!enhancedNote) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Enhanced Notes</h2>
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">No enhanced notes yet</h3>
          <p className="text-sm text-gray-500">
            Add some content to the raw notes and click "Enhance Notes" to see the professional version here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Enhanced Notes</h2>
        <button
          onClick={() => {
            const content = document.getElementById('enhanced-content')?.innerHTML || '';
            navigator.clipboard.writeText(content.replace(/<[^>]*>/g, ''));
          }}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Copy to Clipboard
        </button>
      </div>

      <div id="enhanced-content" className="space-y-6">
        {/* Patient Information */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">👤 Patient Information</h3>
          <p className="text-blue-800">{enhancedNote.patientName}</p>
        </div>

        {/* Patient Status */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">🏥 Patient Status</h3>
          <div className="text-gray-600 prose prose-sm">
            <div 
              dangerouslySetInnerHTML={{ __html: enhancedNote.patientStatus }}
            />
          </div>
        </div>

        {/* Care Provided */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">🩺 Care Provided</h3>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Activities Completed</h4>
            <div 
              className="text-gray-600 prose prose-sm"
              dangerouslySetInnerHTML={{ __html: enhancedNote.careProvided.activitiesCompleted }}
            />
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Patient Response</h4>
            <div 
              className="text-gray-600 prose prose-sm"
              dangerouslySetInnerHTML={{ __html: enhancedNote.careProvided.patientResponse }}
            />
          </div>
        </div>

        {/* Personal Connection Highlights */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">💝 Personal Connection Highlights</h3>
          <div 
            className="text-gray-600 prose prose-sm"
            dangerouslySetInnerHTML={{ __html: enhancedNote.personalConnectionHighlights }}
          />
        </div>

        {/* Areas of Concern */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">⚠️ Areas of Concern</h3>
          <div 
            className="text-gray-600 prose prose-sm"
            dangerouslySetInnerHTML={{ __html: enhancedNote.areasOfConcern }}
          />
        </div>

        {/* Care Plan Adherence */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">📋 Care Plan Adherence</h3>
          <div 
            className="text-gray-600 prose prose-sm"
            dangerouslySetInnerHTML={{ __html: enhancedNote.carePlanAdherence }}
          />
        </div>

        {/* Next Visit Preparations */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">📅 Next Visit Preparations</h3>
          <div 
            className="text-gray-600 prose prose-sm"
            dangerouslySetInnerHTML={{ __html: enhancedNote.nextVisitPreparations }}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancementPanel; 