import React from 'react';

/**
 * Utility to format relative-ish time.
 */
function formatUpdatedAt(ts) {
  if (!ts) return '';
  const date = new Date(ts);
  return date.toLocaleString();
}

/**
 * List of notes with active highlighting and click selection.
 */
// PUBLIC_INTERFACE
export default function NotesList({ notes, selectedId, onSelect }) {
  return (
    <div className="notes-list" role="list" aria-label="Notes list" id="notes-list">
      {notes.map((n) => {
        const isActive = n.id === selectedId;
        return (
          <button
            key={n.id}
            className={`note-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(n.id)}
            aria-current={isActive ? 'true' : 'false'}
            role="listitem"
          >
            <div className="note-title">{n.title || 'Untitled'}</div>
            <div className="note-meta">Updated {formatUpdatedAt(n.updatedAt)}</div>
            <p className="note-preview">
              {n.content ? n.content.slice(0, 120) : 'No content yet...'}
            </p>
          </button>
        );
      })}
      {!notes.length && (
        <div className="helper" aria-live="polite">No notes found.</div>
      )}
    </div>
  );
}
