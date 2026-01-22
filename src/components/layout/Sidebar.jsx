import React from 'react'
import { useAuth } from '../../auth/AuthContext'
import { NavLink } from 'react-router-dom'

function Sidebar({ isOpen, onClose }) {
  const { user, profile, logout } = useAuth()

  const navLinkStyle = ({ isActive }) => ({
    display: 'block',
    padding: '10px 12px',
    borderRadius: 8,
    color: isActive ? '#fff' : '#9ca3af',
    background: isActive ? 'rgba(59,130,246,0.2)' : 'transparent',
    textDecoration: 'none',
    marginBottom: 4,
    fontSize: 14,
    fontWeight: isActive ? 600 : 400,
  })

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 10 }}>
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'Avatar'}
            style={{
              width: 40,
              height: 40,
              borderRadius: '999px',
              border: '2px solid rgba(96,165,250,0.8)',
            }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '999px',
              background:
                'radial-gradient(circle at 30% 0, rgba(96,165,250,0.7), rgba(52,211,153,0.7))',
            }}
          />
        )}
        <div>
          <div style={{ fontWeight: 600 }}>{user?.displayName || 'Focused learner'}</div>
          {profile?.primaryGoal ? (
            <div style={{ fontSize: 12, color: '#9ca3af' }}>{profile.primaryGoal}</div>
          ) : null}
        </div>
      </div>

      <nav style={{ flex: 1 }}>
        <p className="section-title" style={{ marginBottom: 12, paddingLeft: 12 }}>
          Menu
        </p>
        <NavLink to="/" style={navLinkStyle} end onClick={() => onClose && onClose()}>
          Dashboard
        </NavLink>
        <NavLink to="/calendar" style={navLinkStyle} onClick={() => onClose && onClose()}>
          Calendar
        </NavLink>
        <NavLink to="/stats" style={navLinkStyle} onClick={() => onClose && onClose()}>
          Study Stats
        </NavLink>
      </nav>

      <button
        type="button"
        onClick={logout}
        style={{
          marginTop: 'auto',
          background: 'transparent',
          borderRadius: 999,
          border: '1px solid rgba(148,163,184,0.6)',
          padding: '8px 14px',
          color: '#9ca3af',
          fontSize: 13,
          cursor: 'pointer',
          width: '100%',
        }}
      >
        Sign out
      </button>
    </aside>
  )
}

export default Sidebar

