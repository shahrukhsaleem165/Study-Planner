import React, { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useTasks } from '../hooks/useTasks'
import { useSessions } from '../hooks/useSessions'

function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { tasks } = useTasks()
  const { sessions } = useSessions(60) // Get last 60 days of sessions

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const getDayData = date => {
    const dayTasks = tasks.filter(task => {
      if (!task.deadline) return false
      return isSameDay(parseISO(task.deadline), date)
    })

    const daySessions = sessions.filter(session => {
      if (!session.startTime) return false
      return isSameDay(parseISO(session.startTime), date)
    })

    return { tasks: dayTasks, sessions: daySessions }
  }

  return (
    <DashboardLayout>
      <div className="card" style={{ gridColumn: '1 / -1', minHeight: '80vh' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <h2 style={{ margin: 0 }}>{format(currentDate, 'MMMM yyyy')}</h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={prevMonth}
              className="secondary-button"
              style={{ padding: '6px 12px' }}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="secondary-button"
              style={{ padding: '6px 12px' }}
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="secondary-button"
              style={{ padding: '6px 12px' }}
            >
              Next
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 1,
              background: '#374151',
              border: '1px solid #374151',
              borderRadius: 8,
              overflow: 'hidden',
              minWidth: 800,
            }}
          >
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div
                key={day}
                style={{
                  background: '#1f2937',
                  padding: '10px',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#9ca3af',
                }}
              >
                {day}
              </div>
            ))}

            {calendarDays.map(day => {
            const { tasks, sessions } = getDayData(day)
            const isCurrentMonth = isSameMonth(day, monthStart)
            const isToday = isSameDay(day, new Date())

            return (
              <div
                key={day.toString()}
                style={{
                  background: '#0f172a',
                  minHeight: 100,
                  padding: 8,
                  opacity: isCurrentMonth ? 1 : 0.4,
                  border: isToday ? '1px solid #3b82f6' : 'none',
                }}
              >
                <div
                  style={{
                    textAlign: 'right',
                    fontSize: 12,
                    marginBottom: 6,
                    color: isToday ? '#60a5fa' : '#9ca3af',
                    fontWeight: isToday ? 'bold' : 'normal',
                  }}
                >
                  {format(day, 'd')}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {sessions.length > 0 && (
                    <div
                      style={{
                        fontSize: 11,
                        background: 'rgba(34,197,94,0.1)',
                        color: '#4ade80',
                        padding: '2px 6px',
                        borderRadius: 4,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {Math.round(
                        sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0)
                      )}
                      m focus
                    </div>
                  )}

                  {tasks.map(task => (
                    <div
                      key={task.id}
                      style={{
                        fontSize: 11,
                        background: task.completed
                          ? 'rgba(148,163,184,0.1)'
                          : 'rgba(239,68,68,0.1)',
                        color: task.completed ? '#9ca3af' : '#f87171',
                        padding: '2px 6px',
                        borderRadius: 4,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textDecoration: task.completed ? 'line-through' : 'none',
                      }}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CalendarPage
