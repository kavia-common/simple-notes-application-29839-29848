import React from 'react';

/**
 * Layout component rendering a two-pane layout with sidebar and main content.
 * Now supports a collapsible sidebar controlled by parent via props.
 *
 * Props:
 * - sidebar: React node for sidebar content
 * - children: main content
 * - sidebarOpen: boolean controlling if sidebar is open
 * - onCloseSidebar: function to close on overlay click (mobile)
 * - header: optional React node to render above main content (e.g., AppHeader)
 */
// PUBLIC_INTERFACE
export default function Layout({ sidebar, children, sidebarOpen = true, onCloseSidebar, header = null }) {
  /** Wrapper for two-column layout: sidebar + main content area. */
  return (
    <div className="layout" style={{ position: 'relative' }}>
      {/* Static/collapsible sidebar for desktop */}
      <aside
        id="app-sidebar"
        className="sidebar"
        aria-label="Notes sidebar"
        aria-hidden={!sidebarOpen}
        style={{
          transition: 'width 180ms ease, transform 200ms ease',
          width: sidebarOpen ? 320 : 0,
          overflow: 'hidden',
        }}
      >
        {sidebar}
      </aside>

      {/* Mobile overlay sidebar */}
      <div
        className="sidebar-overlay"
        aria-hidden={!sidebarOpen}
        onClick={() => onCloseSidebar?.()}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(1px)',
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? 'auto' : 'none',
          transition: 'opacity 180ms ease',
          zIndex: 25,
        }}
      />
      <aside
        className="sidebar sidebar-mobile"
        aria-label="Notes sidebar"
        aria-hidden={!sidebarOpen}
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          width: 300,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 200ms ease',
          zIndex: 26,
          display: 'none', /* default hidden on desktop */
        }}
      >
        {sidebar}
      </aside>

      <div className="content-shell" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {header}
        {children}
      </div>

      <style>{`
        /* Responsive behavior: show overlay sidebar on mobile narrow screens */
        @media (max-width: 900px) {
          .layout {
            grid-template-columns: 1fr !important;
          }
          .layout > .sidebar {
            display: none;
          }
          .layout .sidebar-mobile {
            display: flex;
            flex-direction: column;
            background: var(--surface);
            border-right: 1px solid var(--border);
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
