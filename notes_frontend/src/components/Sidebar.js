import React from 'react';
import NotesList from './NotesList';

/**
 * Sidebar includes search input, New Note button, and the notes list.
 */
// PUBLIC_INTERFACE
export default function Sidebar({
  notes,
  selectedId,
  onSelect,
  searchQuery,
  onSearch,
  onNew
}) {
  return (
    <div>
      <div className="brand">
        <h1>Ocean Notes</h1>
        <button
          className="btn"
          onClick={onNew}
          aria-label="Create a new note"
          autoFocus
        >
          + New Note
        </button>
      </div>
      <label htmlFor="search" className="helper">Search notes</label>
      <input
        id="search"
        className="input"
        placeholder="Search by title or content..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Search notes"
      />
      <NotesList
        notes={notes}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </div>
  );
}
