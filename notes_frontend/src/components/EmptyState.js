import React from 'react';

/**
 * Empty state displayed when no notes exist.
 */
// PUBLIC_INTERFACE
export default function EmptyState({ onCreate }) {
  return (
    <div className="empty-card" role="status" aria-live="polite">
      <h2>Welcome to Ocean Notes</h2>
      <p>Capture ideas, draft thoughts, and stay organized. Create your first note to get started.</p>
      <button className="btn" onClick={onCreate} aria-label="Create first note">
        + New Note
      </button>
    </div>
  );
}
