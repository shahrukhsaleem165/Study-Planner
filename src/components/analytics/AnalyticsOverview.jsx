import React, { useMemo } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { useSessions } from '../../hooks/useSessions'
import { useTasks } from '../../hooks/useTasks'

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

function groupSessionsByDay(sessions, days = 7) {
  const today = new Date()
  const buckets = []
  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date()
    date.setDate(today.getDate() - index)
    const key = date.toISOString().slice(0, 10)
    const label = date.toLocaleDateString(undefined, { weekday: 'short' })
    buckets.push({ key, label, minutes: 0, sessions: 0 })
  }

  sessions.forEach(session => {
    const bucket = buckets.find(b => b.key === session.date)
    if (bucket) {
      bucket.minutes += session.durationMinutes || 0
      bucket.sessions += 1
    }
  })

  return buckets
}

function groupSessionsByWeek(sessions, weeks = 4) {
  const buckets = []
  const now = new Date()

  for (let index = weeks - 1; index >= 0; index -= 1) {
    const date = new Date(now)
    date.setDate(date.getDate() - index * 7)
    const weekLabel = `Week ${getWeekNumber(date)}`
    buckets.push({ label: weekLabel, minutes: 0, sessions: 0 })
  }

  sessions.forEach(session => {
    if (!session.startTime) return
    const sessionDate = new Date(session.startTime)
    const weekLabel = `Week ${getWeekNumber(sessionDate)}`
    const bucket = buckets.find(b => b.label === weekLabel)
    if (bucket) {
      bucket.minutes += session.durationMinutes || 0
      bucket.sessions += 1
    }
  })

  return buckets
}

function getWeekNumber(date) {
  const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = tempDate.getUTCDay() || 7
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7)
  return weekNo
}

function AnalyticsOverview() {
  const { sessions, loading: sessionsLoading } = useSessions(35)
  const { tasks, loading: tasksLoading } = useTasks()

  const dailyBuckets = useMemo(() => groupSessionsByDay(sessions, 7), [sessions])
  const weeklyBuckets = useMemo(() => groupSessionsByWeek(sessions, 4), [sessions])

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const completionPct = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0

  const totalWeeklySessions = weeklyBuckets.reduce((acc, bucket) => acc + bucket.sessions, 0)

  const dailyFocusData = {
    labels: dailyBuckets.map(bucket => bucket.label),
    datasets: [
      {
        label: 'Focus minutes',
        data: dailyBuckets.map(bucket => Math.round(bucket.minutes)),
        backgroundColor: 'rgba(34,197,94,0.8)',
      },
    ],
  }

  const weeklyFocusData = {
    labels: weeklyBuckets.map(bucket => bucket.label),
    datasets: [
      {
        label: 'Focus hours',
        data: weeklyBuckets.map(bucket => Number((bucket.minutes / 60).toFixed(1))),
        backgroundColor: 'rgba(59,130,246,0.8)',
      },
    ],
  }

  const tasksCompletionData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [completedTasks, totalTasks - completedTasks],
        backgroundColor: ['rgba(34,197,94,0.9)', 'rgba(55,65,81,0.9)'],
        borderWidth: 0,
      },
    ],
  }

  if (sessionsLoading || tasksLoading) {
    return (
      <div className="card">
        <p className="section-title" style={{ marginBottom: 6 }}>
          Analytics
        </p>
        <p style={{ fontSize: 13, color: '#9ca3af' }}>Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="card">
      <p className="section-title" style={{ marginBottom: 6 }}>
        Analytics
      </p>
      {!sessions.length && !tasks.length ? (
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Once you run timers and complete tasks, charts will appear here.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <p style={{ fontSize: 13, marginBottom: 4 }}>Daily focus (last 7 days)</p>
            <Bar
              data={dailyFocusData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: '#9ca3af' } },
                  y: { ticks: { color: '#9ca3af' } },
                },
              }}
            />
          </div>
          <div>
            <p style={{ fontSize: 13, marginBottom: 4 }}>Weekly focus hours</p>
            <Bar
              data={weeklyFocusData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: '#9ca3af' } },
                  y: { ticks: { color: '#9ca3af' } },
                },
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 140, height: 140 }}>
              <Doughnut
                data={tasksCompletionData}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
            <div>
              <p style={{ fontSize: 13, marginBottom: 4 }}>Task completion</p>
              <div style={{ fontSize: 24, fontWeight: 600 }}>{completionPct}%</div>
              <p style={{ fontSize: 12, color: '#9ca3af' }}>
                {completedTasks} of {totalTasks || 0} tasks completed
              </p>
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
                Sessions this month: <strong>{totalWeeklySessions}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalyticsOverview

