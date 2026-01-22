import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth()
  const location = useLocation()

  if (!loading && user) {
    const redirectTo = location.state?.from?.pathname || '/'
    return <Navigate to={redirectTo} replace />
  }

  return (
    <div className="fullpage-center">
      <div className="card" style={{ maxWidth: 420, width: '92%' }}>
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>Study Planner</h1>
        <p style={{ marginTop: 0, marginBottom: 20, color: '#9ca3af' }}>
          Plan deep work, track focus sessions, and see your progress.
        </p>
        <button
          className="primary-button"
          type="button"
          onClick={signInWithGoogle}
          disabled={loading}
        >
          <span>Sign in with Google</span>
        </button>
        <p style={{ marginTop: 20, fontSize: 12, color: '#6b7280' }}>
          Your data is securely stored in your private Firebase account.
        </p>
      </div>
    </div>
  )
}

export default LoginPage

