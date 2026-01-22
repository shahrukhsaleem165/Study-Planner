import React, { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth()
  const location = useLocation()
  const [error, setError] = useState('')

  if (!loading && user) {
    const redirectTo = location.state?.from?.pathname || '/'
    return <Navigate to={redirectTo} replace />
  }

  const handleLogin = async () => {
    setError('')
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error(err)
      if (err.code === 'auth/unauthorized-domain') {
        setError('Domain not authorized. Please add this domain in Firebase Console -> Authentication -> Settings.')
      } else if (err.code === 'auth/api-key-not-valid-please-pass-a-valid-api-key') {
        setError('Invalid API Key. Please check Vercel Environment Variables.')
      } else {
        setError('Failed to sign in: ' + err.message)
      }
    }
  }

  return (
    <div className="fullpage-center">
      <div className="card" style={{ maxWidth: 420, width: '92%' }}>
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>Study Planner</h1>
        <p style={{ marginTop: 0, marginBottom: 20, color: '#9ca3af' }}>
          Plan deep work, track focus sessions, and see your progress.
        </p>

        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <button
          className="primary-button"
          type="button"
          onClick={handleLogin}
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

