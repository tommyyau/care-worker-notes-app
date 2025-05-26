import { useState, useEffect } from 'react'
import type { CareNote } from '../types'
import { storageUtils } from '../utils/storage'

interface NotesHistoryProps {
  onLoadNote: (note: CareNote) => void
  onClose: () => void
  isOpen: boolean
}

export default function NotesHistory({ onLoadNote, onClose, isOpen }: NotesHistoryProps) {
  const [notes, setNotes] = useState<CareNote[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'patient'>('date')

  useEffect(() => {
    if (isOpen) {
      loadNotes()
    }
  }, [isOpen])

  const loadNotes = () => {
    const allNotes = storageUtils.getNotes()
    setNotes(allNotes)
  }

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      storageUtils.deleteNote(noteId)
      loadNotes()
    }
  }

  const filteredNotes = notes
    .filter(note => 
      note.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.rawContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.date.includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      } else {
        return a.patient.localeCompare(b.patient)
      }
    })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Notes History</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search notes by patient, content, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'patient')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="patient">Sort by Patient</option>
            </select>
          </div>
        </div>

        {/* Notes List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">
                {searchTerm ? 'No notes found matching your search.' : 'No saved notes yet.'}
              </p>
              <p className="text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Start by creating and saving your first note.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotes.map((note) => (
                <div key={note.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{note.patient}</h3>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{note.date} at {note.time}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {note.visitType}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {note.rawContent.substring(0, 150)}
                        {note.rawContent.length > 150 ? '...' : ''}
                      </p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => {
                            onLoadNote(note)
                            onClose()
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Load Note
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                        <span className="text-xs text-gray-400">
                          {note.enhancedContent ? 'Enhanced' : 'Raw only'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''} found</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 