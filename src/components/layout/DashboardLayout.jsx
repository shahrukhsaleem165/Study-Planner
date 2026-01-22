import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="layout-root">
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout

