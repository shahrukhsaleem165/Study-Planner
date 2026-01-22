import React from 'react'

function Header({ onMenuClick }) {
  const now = new Date()
  const dateString = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  return (
    <header
      style={{
        padding: '18px 24px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div>
          <p className="section-title" style={{ marginBottom: 4 }}>
            Dashboard
          </p>
          <h1 style={{ margin: 0, fontSize: 22 }}>Your study cockpit</h1>
        </div>
      </div>
      <div style={{ textAlign: 'right', fontSize: 13, color: '#9ca3af' }}>
        <div>{dateString}</div>
      </div>
    </header>
  )
}

export default Header

