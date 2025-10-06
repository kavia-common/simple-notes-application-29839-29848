import React from 'react';

/**
 * Layout component rendering a two-pane layout with sidebar and main content.
 * Keeps structure minimal and accessible.
 */
// PUBLIC_INTERFACE
export default function Layout({ sidebar, children }) {
  /** Wrapper for two-column layout: sidebar + main content area. */
  return (
    <div className="layout">
      <aside className="sidebar" aria-label="Notes sidebar">
        {sidebar}
      </aside>
      {children}
    </div>
  );
}
