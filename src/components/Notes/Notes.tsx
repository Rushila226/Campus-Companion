import React, { useState } from 'react';
import { Plus, Search, BookOpen, Edit, Trash2, Save } from 'lucide-react';
import { Note } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const Notes: React.FC = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>('campus_notes', []);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingContent, setEditingContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subjects = [...new Set(notes.map(note => note.subject))];

  const handleAddNote = (newNote: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const noteWithId = {
      ...newNote,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([...notes, noteWithId]);
    setShowAddForm(false);
    setSelectedNote(noteWithId);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const handleEditNote = () => {
    if (selectedNote) {
      setEditingContent(selectedNote.content);
      setIsEditing(true);
    }
  };

  const handleSaveNote = () => {
    if (selectedNote) {
      const updatedNote = {
        ...selectedNote,
        content: editingContent,
        updatedAt: new Date().toISOString(),
      };
      setNotes(notes.map(n => n.id === selectedNote.id ? updatedNote : n));
      setSelectedNote(updatedNote);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingContent('');
  };

  return (
    <div className="h-full flex">
      <div className="w-80 bg-purple-100/30 backdrop-blur-xl border-r border-purple-200 flex flex-col">
        <div className="p-6 border-b border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-purple-900">Notes</h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-purple-400 to-purple-300 text-purple-900 p-2 rounded-lg font-semibold hover:from-purple-500 hover:to-purple-400 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-purple-50 border border-purple-300 rounded-xl text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {subjects.length > 0 && (
            <div className="space-y-4">
              {subjects.map(subject => {
                const subjectNotes = filteredNotes.filter(note => note.subject === subject);
                if (subjectNotes.length === 0) return null;

                return (
                  <div key={subject}>
                    <h3 className="text-sm font-semibold text-purple-700 mb-2 px-2">{subject}</h3>
                    <div className="space-y-2">
                      {subjectNotes.map(note => (
                        <div
                          key={note.id}
                          onClick={() => setSelectedNote(note)}
                          className={`p-3 rounded-xl cursor-pointer transition-all group ${
                            selectedNote?.id === note.id
                              ? 'bg-purple-300/30 border border-purple-400'
                              : 'bg-purple-50 hover:bg-purple-100 border border-transparent'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-purple-900 text-sm mb-1 truncate">
                                {note.title}
                              </h4>
                              <p className="text-purple-700 text-xs line-clamp-2">
                                {note.content.substring(0, 100)}...
                              </p>
                              <p className="text-purple-500 text-xs mt-1">
                                {new Date(note.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNote(note.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-purple-400 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredNotes.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-purple-300 mx-auto mb-3" />
              <p className="text-purple-500">
                {searchTerm ? 'No notes found' : 'No notes yet'}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="p-6 border-b border-purple-200 bg-purple-100/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-purple-900 mb-1">{selectedNote.title}</h2>
                  <p className="text-purple-700">{selectedNote.subject}</p>
                  <p className="text-sm text-purple-500 mt-1">
                    Last updated: {new Date(selectedNote.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveNote}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-purple-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-500 transition-all"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditNote}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 transition-all flex items-center space-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 p-6">
              {isEditing ? (
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="w-full h-full bg-purple-50 border border-purple-300 rounded-xl text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 p-4 resize-none"
                  placeholder="Start writing your notes..."
                />
              ) : (
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-purple-800 leading-relaxed">
                    {selectedNote.content}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-purple-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-purple-400 mb-2">Select a note to view</h3>
              <p className="text-purple-500">Choose a note from the sidebar or create a new one</p>
            </div>
          </div>
        )}
      </div>

      {showAddForm && (
        <NoteForm
          subjects={subjects}
          onSave={handleAddNote}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

interface NoteFormProps {
  subjects: string[];
  onSave: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ subjects, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-purple-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-purple-100/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-300 w-full max-w-md">
        <h2 className="text-xl font-bold text-purple-900 mb-6">Add New Note</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-purple-50 border border-purple-300 rounded-xl text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">Subject</label>
            <input
              type="text"
              list="subjects"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 bg-purple-50 border border-purple-300 rounded-xl text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            <datalist id="subjects">
              {subjects.map(subject => (
                <option key={subject} value={subject} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 bg-purple-50 border border-purple-300 rounded-xl text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              placeholder="Start writing your notes..."
              required
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-400 to-purple-300 text-purple-900 py-3 rounded-xl font-semibold hover:from-purple-500 hover:to-purple-400 transition-all"
            >
              Create Note
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-purple-50 text-purple-900 py-3 rounded-xl font-semibold hover:bg-purple-100 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
