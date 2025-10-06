import React from 'react';
import './App.css';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import NoteView from './components/NoteView';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import { useLocalNotes } from './hooks/useLocalNotes';

// PUBLIC_INTERFACE
function App() {
  /**
   * Top-level App orchestrates the two-pane layout and wires up the custom hook.
   * Implements a modern, Ocean Professional themed UI for a simple notes CRUD app.
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

  return (
    <div className="ocean-app" role="application" aria-label="Simple Notes Application">
      <Layout
        sidebar={
          <Sidebar
            notes={filteredNotes}
            selectedId={selectedNoteId}
            onSelect={selectNote}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onNew={startCreate}
          />
        }
      >
        <main className="main-surface" role="main" aria-live="polite">
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
