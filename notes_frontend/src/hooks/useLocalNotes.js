import { useCallback, useEffect, useMemo, useState } from 'react';
import { storageGet, storageSet } from '../utils/storage';
import { newId } from '../utils/id';

const STORAGE_NOTES = 'notes';
const STORAGE_SELECTED = 'selected';
const STORAGE_EDITING = 'editing';

/**
 * Represents a note entity.
 * { id, title, content, createdAt, updatedAt }
 */

/**
 * Custom hook for managing notes with localStorage persistence.
 * Provides CRUD operations, selection, basic search, and edit mode handling.
 */
// PUBLIC_INTERFACE
export function useLocalNotes() {
  const [notes, setNotes] = useState(() => storageGet(STORAGE_NOTES, []));
  const [selectedNoteId, setSelectedNoteId] = useState(() => storageGet(STORAGE_SELECTED, null));
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(() => storageGet(STORAGE_EDITING, false));
  const [draft, setDraft] = useState(null);

  // persist notes and selection
  useEffect(() => {
    storageSet(STORAGE_NOTES, notes);
  }, [notes]);

  useEffect(() => {
    storageSet(STORAGE_SELECTED, selectedNoteId);
  }, [selectedNoteId]);

  useEffect(() => {
    storageSet(STORAGE_EDITING, isEditing);
  }, [isEditing]);

  const selectedNote = useMemo(
    () => notes.find(n => n.id === selectedNoteId) || null,
    [notes, selectedNoteId]
  );

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return notes.slice().sort((a, b) => b.updatedAt - a.updatedAt);
    return notes
      .filter(n =>
        (n.title || '').toLowerCase().includes(q) ||
        (n.content || '').toLowerCase().includes(q)
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, searchQuery]);

  const selectNote = useCallback((id) => {
    setSelectedNoteId(id);
    setIsEditing(false);
    setDraft(null);
  }, []);

  const createNote = useCallback((partial) => {
    const id = newId();
    const now = Date.now();
    const note = {
      id,
      title: partial?.title || 'Untitled',
      content: partial?.content || '',
      createdAt: now,
      updatedAt: now
    };
    setNotes(prev => [note, ...prev]);
    setSelectedNoteId(id);
    return note;
  }, []);

  const updateNote = useCallback((id, patch) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n))
    );
  }, []);

  const deleteNote = useCallback((id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    setSelectedNoteId(prev => (prev === id ? null : prev));
    setIsEditing(false);
  }, []);

  // Editing workflow
  const startCreate = useCallback(() => {
    setDraft({ title: '', content: '' });
    setIsEditing(true);
    setSelectedNoteId(null);
  }, []);

  const startEdit = useCallback(() => {
    if (!selectedNote) return;
    setDraft({ id: selectedNote.id, title: selectedNote.title, content: selectedNote.content });
    setIsEditing(true);
  }, [selectedNote]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setDraft(null);
    // restore selection remains as-is
  }, []);

  const saveCurrentEditor = useCallback((data) => {
    if (draft?.id) {
      // update
      updateNote(draft.id, { title: data.title, content: data.content });
      setSelectedNoteId(draft.id);
    } else {
      // create
      const created = createNote({ title: data.title, content: data.content });
      setSelectedNoteId(created.id);
    }
    setIsEditing(false);
    setDraft(null);
  }, [createNote, draft, updateNote]);

  return {
    notes,
    filteredNotes,
    selectedNoteId,
    selectedNote: draft?.id ? draft : selectedNote,
    isEditing,
    searchQuery,
    // Actions
    setSearchQuery,
    selectNote,
    createNote,
    updateNote,
    deleteNote,
    startCreate,
    startEdit,
    cancelEdit,
    saveCurrentEditor
  };
}
