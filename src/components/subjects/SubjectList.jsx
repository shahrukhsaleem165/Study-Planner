import React from 'react'
import { useSubjects } from '../../hooks/useSubjects'

function SubjectList({ selectedId, onSelect }) {
  const { subjects, loading } = useSubjects()

  if (loading) {
    return <p style={{ fontSize: 13, color: '#9ca3af' }}>Loading subjects...</p>
  }

  if (!subjects.length) {
    return <p style={{ fontSize: 13, color: '#6b7280' }}>No subjects yet. Add one to get started.</p>
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {subjects.map(subject => {
        const isActive = subject.id === selectedId
        return (
          <button
            key={subject.id}
            type="button"
            onClick={() => onSelect?.(isActive ? null : subject.id)}
            style={{
              padding: '6px 10px',
              borderRadius: 999,
              border: isActive
                ? '1px solid rgba(34,197,94,0.9)'
                : '1px solid rgba(148,163,184,0.6)',
              background: isActive ? 'rgba(22,163,74,0.18)' : 'transparent',
              color: isActive ? '#bbf7d0' : '#e5e7eb',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {subject.name}
          </button>
        )
      })}
    </div>
  )
}

export default SubjectList

