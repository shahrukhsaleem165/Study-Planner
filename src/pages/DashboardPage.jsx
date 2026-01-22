import React, { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import SubjectForm from '../components/subjects/SubjectForm'
import SubjectList from '../components/subjects/SubjectList'
import TaskForm from '../components/tasks/TaskForm'
import TaskList from '../components/tasks/TaskList'
import FocusTimer from '../components/timer/FocusTimer'
import AnalyticsOverview from '../components/analytics/AnalyticsOverview'
import MotivationWidget from '../components/quotes/MotivationWidget'

function DashboardPage() {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null)

  return (
    <DashboardLayout>
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="card">
          <div style={{ marginBottom: 10 }}>
            <p className="section-title" style={{ marginBottom: 6 }}>
              Subjects
            </p>
          </div>
          <SubjectForm />
          <SubjectList selectedId={selectedSubjectId} onSelect={setSelectedSubjectId} />
        </div>
        <div className="card">
          <div style={{ marginBottom: 10 }}>
            <p className="section-title" style={{ marginBottom: 6 }}>
              Tasks
            </p>
          </div>
          <TaskForm />
          <TaskList />
        </div>
      </section>
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <FocusTimer />
        <AnalyticsOverview />
        <MotivationWidget />
      </section>
    </DashboardLayout>
  )
}

export default DashboardPage

