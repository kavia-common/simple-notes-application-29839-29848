import React, { useEffect, useRef, useState } from 'react';

/**
 * Editor for creating or updating a note.
 * Accepts existing note or new draft via note prop.
 */
// PUBLIC_INTERFACE
export default function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');

  const titleRef = useRef(null);

  useEffect(() => {
    setTitle(note?.title ?? '');
    setContent(note?.content ?? '');
  }, [note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Focus on title on enter
    titleRef.current?.focus();
    titleRef.current?.select();
  }, []);

  const handleSave = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    onSave({
      ...(note?.id ? { id: note.id } : {}),
      title: trimmedTitle || 'Untitled',
      content: trimmedContent
    });
  };

  return (
    <section className="note-surface" aria-label="Note editor">
      <div className="note-header">
        <input
          ref={titleRef}
          className="note-title-input"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Note title"
        />
        <div className="note-actions">
          <button className="btn secondary" onClick={onCancel} aria-label="Cancel editing">
            Cancel
          </button>
          <button className="btn" onClick={handleSave} aria-label="Save note">
            Save
          </button>
        </div>
      </div>
      <textarea
        className="note-content-input"
        placeholder="Write your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        aria-label="Note content"
      />
      <div className="helper" style={{ marginTop: 8 }}>
        Tips: Use a descriptive title. Your notes are saved in your browser.
      </div>
    </section>
  );
}
