import React from 'react'
import { useTasks } from '../../hooks/useTasks'
import { useSubjects } from '../../hooks/useSubjects'

function TaskList() {
  const { tasks, loading, toggleTaskCompletion, deleteTask } = useTasks()
  const { subjects } = useSubjects()

  const subjectById = subjects.reduce((acc, item) => {
    acc[item.id] = item
    return acc
  }, {})

  if (loading) {
    return <p style={{ fontSize: 13, color: '#9ca3af' }}>Loading tasks...</p>
  }

  if (!tasks.length) {
    return <p style={{ fontSize: 13, color: '#6b7280' }}>No tasks yet. Create your first one above.</p>
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginTop: 8 }}>
      {tasks.map(task => {
        const subject = task.subjectId ? subjectById[task.subjectId] : null
        const deadlineLabel = task.deadline
          ? new Date(task.deadline).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })
          : 'No due date'

        return (
          <li
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 8px',
              borderRadius: 10,
              border: '1px solid rgba(31,41,55,0.8)',
              marginBottom: 6,
            }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={event => toggleTaskCompletion(task.id, event.target.checked)}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? '#6b7280' : '#e5e7eb',
                  fontSize: 14,
                }}
              >
                {task.title}
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>
                {subject ? subject.name : 'General'} • {deadlineLabel}
              </div>
            </div>
            <button
              type="button"
              onClick={() => deleteTask(task.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#6b7280',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Remove
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default TaskList

