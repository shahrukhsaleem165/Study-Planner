import React, { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useSessions } from '../hooks/useSessions'
import { useSubjects } from '../hooks/useSubjects'
import { startOfWeek, eachDayOfInterval, format, subDays, isSameDay, parseISO } from 'date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

function StatsPage() {
  const { sessions } = useSessions(30) // Last 30 days
  const { subjects } = useSubjects()

  // 1. Study Hours by Subject (Doughnut)
  const subjectData = useMemo(() => {
    const data = {}
    sessions.forEach(session => {
      const subjectId = session.subjectId || 'uncategorized'
      data[subjectId] = (data[subjectId] || 0) + (session.durationMinutes || 0)
    })

    const labels = Object.keys(data).map(id => {
      if (id === 'uncategorized') return 'General Focus'
      const subject = subjects.find(s => s.id === id)
      return subject ? subject.name : 'Unknown'
    })

    const values = Object.values(data).map(mins => Math.round(mins / 60 * 10) / 10) // Convert to hours

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            '#3b82f6',
            '#ef4444',
            '#22c55e',
            '#eab308',
            '#a855f7',
            '#ec4899',
            '#64748b',
          ],
          borderColor: '#1f2937',
          borderWidth: 2,
        },
      ],
    }
  }, [sessions, subjects])

  // 2. Study Hours Last 7 Days (Bar)
  const weeklyData = useMemo(() => {
    const end = new Date()
    const start = subDays(end, 6)
    const days = eachDayOfInterval({ start, end })

    const data = days.map(day => {
      const daySessions = sessions.filter(s => isSameDay(parseISO(s.startTime), day))
      const totalMinutes = daySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0)
      return Math.round(totalMinutes / 60 * 10) / 10
    })

    return {
      labels: days.map(day => format(day, 'EEE')),
      datasets: [
        {
          label: 'Hours Studied',
          data,
          backgroundColor: '#3b82f6',
          borderRadius: 4,
        },
      ],
    }
  }, [sessions])

  // 3. Total Stats
  const totalStats = useMemo(() => {
    const totalMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0)
    const totalHours = Math.round(totalMinutes / 60 * 10) / 10
    const totalSessions = sessions.length
    
    // Calculate streak (simplified)
    // In a real app, this would be more complex logic
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
        const checkDate = subDays(today, i)
        const hasSession = sessions.some(s => isSameDay(parseISO(s.startTime), checkDate))
        if (hasSession) {
            streak++
        } else if (i > 0) { // Allow today to be empty if it's early
             break
        }
    }

    return { totalHours, totalSessions, streak }
  }, [sessions])

  return (
    <DashboardLayout>
      <div className="stats-summary-grid">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#3b82f6' }}>{totalStats.totalHours}</div>
          <div style={{ color: '#9ca3af', fontSize: 14 }}>Total Hours</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#22c55e' }}>{totalStats.totalSessions}</div>
          <div style={{ color: '#9ca3af', fontSize: 14 }}>Total Sessions</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#eab308' }}>{totalStats.streak}</div>
          <div style={{ color: '#9ca3af', fontSize: 14 }}>Day Streak</div>
        </div>
      </div>

      <div className="stats-charts-grid">
        <div className="card">
          <h3 className="section-title">Weekly Activity</h3>
          <div style={{ height: 300 }}>
            <Bar 
              data={weeklyData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true, grid: { color: '#374151' } },
                  x: { grid: { display: false } }
                },
                plugins: { legend: { display: false } }
              }} 
            />
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Subject Distribution</h3>
          <div style={{ height: 300, display: 'flex', justifyContent: 'center' }}>
            <Doughnut 
              data={subjectData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#e5e7eb' } } }
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StatsPage
