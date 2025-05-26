import { useState } from 'react'
import type { CareNote, EnhancedNote, VisitType } from './types'
import { storageUtils, generateId, formatDateTime } from './utils/storage'
import { isApiKeyConfigured } from './services/openai'
import AudioRecorder from './components/AudioRecorder.js'
import ApiKeyWarning from './components/ApiKeyWarning.js'
import NotesHistory from './components/NotesHistory.js'

function App() {
  const [rawContent, setRawContent] = useState('')
  const [enhancedNote, setEnhancedNote] = useState<EnhancedNote | null>(null)
  const [visitType, setVisitType] = useState<VisitType>('standard')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null)
  const [showNotesHistory, setShowNotesHistory] = useState(false)

  // Check if API key is configured
  const apiKeyConfigured = isApiKeyConfigured()

  const handleTranscriptionComplete = (transcript: string) => {
    setRawContent(prev => prev + (prev ? ' ' : '') + transcript)
  }

  const handleEnhanceNotes = async () => {
    if (!rawContent.trim()) {
      alert('Please add some content to enhance.')
      return
    }

    setIsEnhancing(true)
    try {
      const { openaiService } = await import('./services/openai')
      const enhanced = await openaiService.enhanceNotes(rawContent, visitType)
      setEnhancedNote(enhanced)
    } catch (error) {
      console.error('Enhancement error:', error)
      alert(error instanceof Error ? error.message : 'Failed to enhance notes')
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleSaveNote = () => {
    if (!rawContent.trim()) {
      alert('Please add some content before saving.')
      return
    }

    const { date, time, iso } = formatDateTime()
    const noteId = currentNoteId || generateId()
    
    const note: CareNote = {
      id: noteId,
      date,
      time,
      careWorker: 'Current User', // TODO: Add user management
      patient: enhancedNote?.patientName || 'Unknown Patient',
      patientId: `PAT-${noteId.slice(-6).toUpperCase()}`,
      visitType,
      rawContent,
      enhancedContent: enhancedNote || undefined,
      templateType: visitType,
      createdAt: currentNoteId ? storageUtils.getNoteById(noteId)?.createdAt || iso : iso,
      updatedAt: iso
    }

    storageUtils.saveNote(note)
    setCurrentNoteId(noteId)
    alert('Note saved successfully!')
  }

  const handleNewNote = () => {
    setRawContent('')
    setEnhancedNote(null)
    setCurrentNoteId(null)
    setVisitType('standard')
  }

  const handleLoadNote = (note: CareNote) => {
    setRawContent(note.rawContent)
    setEnhancedNote(note.enhancedContent || null)
    setCurrentNoteId(note.id)
    setVisitType(note.visitType as VisitType)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="http://www.timeforyoucare.co.uk/img/logo.svg" 
                alt="Time for You Care" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Care Notes App</h1>
                <p className="text-sm text-gray-600">Professional person-centered care</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* API Key Warning */}
      {!apiKeyConfigured && <ApiKeyWarning />}

      {/* Main Content - Two Panel Layout */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Your Notes Input */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Notes Input</h2>
              
              {/* Recording Mode Section */}
              <div className="mb-6">
                <AudioRecorder 
                  onTranscriptionComplete={handleTranscriptionComplete}
                  disabled={!apiKeyConfigured}
                />
              </div>

              {/* Raw Notes Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Raw Notes</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowNotesHistory(true)}
                      className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      View History
                    </button>
                    <button
                      onClick={handleNewNote}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                <textarea
                  value={rawContent}
                  onChange={(e) => setRawContent(e.target.value)}
                  placeholder="Your notes will appear here as you speak, or you can type directly..."
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleEnhanceNotes}
                  disabled={!rawContent.trim() || isEnhancing || !apiKeyConfigured}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {isEnhancing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Enhance Notes
                    </>
                  )}
                </button>
                <button
                  onClick={handleSaveNote}
                  disabled={!rawContent.trim()}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Note
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Enhanced Professional Note */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Enhanced Professional Note</h2>
              
              {isEnhancing ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600 mb-2">Enhancing your notes...</p>
                  <p className="text-sm text-gray-500">This may take a few seconds</p>
                </div>
              ) : !enhancedNote ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-2">Your enhanced note will appear here after you enhance your raw notes.</p>
                  <p className="text-sm text-gray-500">Start by entering notes or using speech-to-text, then click "Enhance Notes".</p>
                </div>
              ) : (
                <div className="space-y-6">
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
              )}
            </div>
          </div>
        </div>


              </main>

        {/* Notes History Modal */}
        <NotesHistory
          isOpen={showNotesHistory}
          onClose={() => setShowNotesHistory(false)}
          onLoadNote={handleLoadNote}
        />
      </div>
    )
  }

export default App
