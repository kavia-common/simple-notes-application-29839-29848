import React, { useEffect, useRef, useState } from 'react';

/**
 * AppHeader renders the top navigation bar for the application.
 * Includes: hamburger toggle, title, center search, right-side actions.
 *
 * Props:
 * - isSidebarOpen: boolean controlling sidebar visibility (for aria-expanded)
 * - onToggleSidebar: function to toggle sidebar (required)
 * - onSearch: function to handle global search change (optional, TODO integrated)
 * - onNewNote: function called when "New Note" is clicked (optional)
 * - context: optional string or node for breadcrumb/context (optional)
 *
 * Accessibility:
 * - Hamburger button has aria-controls="app-sidebar" and aria-expanded state
 * - Focusable controls with keyboard support (Space/Enter)
 * - Header is marked as role="banner"
 */
// PUBLIC_INTERFACE
export default function AppHeader({
  isSidebarOpen,
  onToggleSidebar,
  onSearch,
  onNewNote,
  context
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Expand-on-focus behavior: store original width and expand on focus visually via class.
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // No-op: could hydrate query from higher-level state if needed.
  }, []);

  const handleKeyToggle = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggleSidebar?.();
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) {
      onSearch(val);
    } else {
      // TODO: Wire to global search when available
    }
  };

  return (
    <header
      className="app-header"
      role="banner"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'var(--surface)',
        boxShadow: 'var(--shadow-sm)',
        borderBottom: '1px solid var(--border)'
      }}
    >
      <div
        className="app-header-inner"
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          gap: 12,
          height: 64,
          padding: '0 16px',
        }}
      >
        <div
          className="left"
          style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}
        >
          <button
            type="button"
            className="icon-btn"
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-controls="app-sidebar"
            aria-expanded={Boolean(isSidebarOpen)}
            onClick={onToggleSidebar}
            onKeyDown={handleKeyToggle}
            title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            <span aria-hidden="true" className="hamburger" />
          </button>
          <div className="title-wrap" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="app-title" style={{ fontWeight: 800, fontSize: 18, letterSpacing: 0.2 }}>
              Notes
            </div>
            {context ? (
              <div className="app-context" style={{ fontSize: 12, color: 'var(--muted)' }}>
                {context}
              </div>
            ) : null}
          </div>
        </div>

        <div className="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            className={`search-wrap ${isFocused ? 'focused' : ''}`}
            style={{
              width: '100%',
              maxWidth: 560,
              transition: 'max-width 180ms ease',
            }}
          >
            <label htmlFor="global-search" className="sr-only">Search notes</label>
            <input
              id="global-search"
              ref={inputRef}
              className="input search-input"
              placeholder="Search notes…"
              value={query}
              onChange={handleSearchChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              aria-label="Search notes"
              style={{
                transition: 'box-shadow 150ms ease, border-color 150ms ease, background-color 150ms ease',
              }}
            />
          </div>
        </div>

        <div className="right" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            className="btn"
            onClick={() => onNewNote?.()}
            aria-label="Create a new note from header"
          >
            + New Note
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Open settings"
            title="Settings"
          >
            <span aria-hidden="true" className="gear" />
          </button>
        </div>
      </div>
    </header>
  );
}
