import React from 'react';

/**
 * Display a selected note with actions.
 */
// PUBLIC_INTERFACE
export default function NoteView({ note, onEdit, onDelete }) {
  if (!note) {
    return (
      <div className="note-surface" aria-live="polite">
        <div className="helper">Select a note from the list or create a new one.</div>
      </div>
    );
  }

  return (
    <section className="note-surface" aria-label="Note view">
      <header className="note-header">
        <h2 style={{ margin: 0 }}>{note.title || 'Untitled'}</h2>
        <div className="note-actions">
          <button className="btn secondary" onClick={onEdit} aria-label="Edit note">
            Edit
          </button>
          <button className="btn danger" onClick={onDelete} aria-label="Delete note">
            Delete
          </button>
        </div>
      </header>
      <div className="helper" style={{ marginBottom: 12 }}>
        Last updated {new Date(note.updatedAt).toLocaleString()}
      </div>
      <article style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
        {note.content || 'No content yet.'}
      </article>
    </section>
  );
}
