import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './styles/header.css';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import NoteView from './components/NoteView';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import { useLocalNotes } from './hooks/useLocalNotes';
import AppHeader from './components/layout/AppHeader';

const STORAGE_SIDEBAR_OPEN = 'ui:sidebar-open';
const STORAGE_NOTES_FILTER = 'notesFilter';

// PUBLIC_INTERFACE
function App() {
  /**
   * Top-level App orchestrates the two-pane layout and wires up the custom hook.
   * Implements a modern, Ocean Professional themed UI for a simple notes CRUD app.
   * Adds a sticky AppHeader, collapsible sidebar, and header tabs filtering.
   */
  const {
    notes,
    filteredNotes,
    selectedNoteId,
    selectedNote,
    isEditing,
    searchQuery,
    selectNote,
    createNote,
    updateNote,
    deleteNote,
    setSearchQuery,
    startCreate,
    startEdit,
    cancelEdit,
    saveCurrentEditor,
  } = useLocalNotes();

  // Global UI state for sidebar visibility with localStorage persistence
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const raw = window.localStorage.getItem(`ocean-notes:${STORAGE_SIDEBAR_OPEN}`);
      return raw == null ? true : JSON.parse(raw);
    } catch {
      return true;
    }
  });

  // Header tabs filter persisted in localStorage
  const [filter, setFilter] = useState(() => {
    try {
      const raw = window.localStorage.getItem(`ocean-notes:${STORAGE_NOTES_FILTER}`);
      const parsed = raw == null ? 'all' : JSON.parse(raw);
      return parsed === 'favorites' || parsed === 'archived' ? parsed : 'all';
    } catch {
      return 'all';
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(`ocean-notes:${STORAGE_SIDEBAR_OPEN}`, JSON.stringify(sidebarOpen));
    } catch {
      // ignore storage errors
    }
  }, [sidebarOpen]);

  useEffect(() => {
    try {
      window.localStorage.setItem(`ocean-notes:${STORAGE_NOTES_FILTER}`, JSON.stringify(filter));
    } catch {
      // ignore storage errors
    }
  }, [filter]);

  const toggleSidebar = () => setSidebarOpen((s) => !s);
  const closeSidebar = () => setSidebarOpen(false);

  // Combine header filter with existing search-based filteredNotes.
  // We treat missing favorite/archived fields as false.
  const filteredByTab = useMemo(() => {
    const src = filteredNotes; // already sorted by updatedAt desc and filtered by search
    if (filter === 'favorites') {
      return src.filter(n => Boolean(n.favorite ?? n.isFavorite ?? false));
    }
    if (filter === 'archived') {
      return src.filter(n => Boolean(n.archived ?? n.isArchived ?? false));
    }
    return src;
  }, [filteredNotes, filter]);

  return (
    <div className="ocean-app" role="application" aria-label="Simple Notes Application">
      <Layout
        sidebarOpen={sidebarOpen}
        onCloseSidebar={closeSidebar}
        header={
          <AppHeader
            isSidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
            onSearch={setSearchQuery /* consider debouncing for large datasets */}
            onNewNote={startCreate}
            context={null}
            filter={filter}
            onFilterChange={setFilter}
          />
        }
        sidebar={
          <Sidebar
            notes={filteredByTab}
            selectedId={selectedNoteId}
            onSelect={(id) => {
              selectNote(id);
              // On mobile, close the sidebar when a note is selected for better UX
              if (window.innerWidth <= 900) closeSidebar();
            }}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onNew={startCreate}
          />
        }
      >
        <main
          className="main-surface"
          role="main"
          aria-live="polite"
          style={{ paddingTop: 24 }}
          id="notes-list"
        >
          {!notes.length && !isEditing && (
            <EmptyState onCreate={startCreate} />
          )}

          {isEditing && (
            <NoteEditor
              note={selectedNote}
              onCancel={cancelEdit}
              onSave={saveCurrentEditor}
            />
          )}

          {!isEditing && notes.length > 0 && (
            <NoteView
              note={selectedNote}
              onEdit={startEdit}
              onDelete={() => {
                if (selectedNote && window.confirm('Delete this note?')) {
                  deleteNote(selectedNote.id);
                }
              }}
            />
          )}
        </main>
      </Layout>
    </div>
  );
}

export default App;
