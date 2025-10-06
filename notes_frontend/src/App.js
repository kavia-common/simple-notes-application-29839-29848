import React, { useEffect, useState } from 'react';
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

// PUBLIC_INTERFACE
function App() {
  /**
   * Top-level App orchestrates the two-pane layout and wires up the custom hook.
   * Implements a modern, Ocean Professional themed UI for a simple notes CRUD app.
   * Adds a sticky AppHeader and collapsible sidebar with preference persisted.
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

  useEffect(() => {
    try {
      window.localStorage.setItem(`ocean-notes:${STORAGE_SIDEBAR_OPEN}`, JSON.stringify(sidebarOpen));
    } catch {
      // ignore storage errors
    }
  }, [sidebarOpen]);

  const toggleSidebar = () => setSidebarOpen((s) => !s);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="ocean-app" role="application" aria-label="Simple Notes Application">
      <Layout
        sidebarOpen={sidebarOpen}
        onCloseSidebar={closeSidebar}
        header={
          <AppHeader
            isSidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
            onSearch={setSearchQuery /* TODO: consider debouncing for large datasets */}
            onNewNote={startCreate}
            context={null}
          />
        }
        sidebar={
          <Sidebar
            notes={filteredNotes}
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
