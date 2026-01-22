import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useAuth } from '../auth/AuthContext'
import { db } from '../firebase'

function OnboardingPage() {
  const { user, profile, setProfile } = useAuth()
  const navigate = useNavigate()
  const [primaryGoal, setPrimaryGoal] = useState(profile?.primaryGoal || '')
  const [defaultFocusMinutes, setDefaultFocusMinutes] = useState(
    profile?.defaultFocusMinutes || 25,
  )
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!user) {
    return null
  }

  const handleSubmit = async event => {
    event.preventDefault()
    
    if (!primaryGoal.trim()) {
      setError('Please enter your primary study goal to continue.')
      return
    }

    setError('')
    setIsSubmitting(true)

    const updates = {
      primaryGoal,
      defaultFocusMinutes: Number(defaultFocusMinutes) || 25,
      onboarded: true,
      updatedAt: serverTimestamp(),
    }

    // Optimistically update local state immediately
    if (setProfile) {
      setProfile(prev => ({ ...prev, ...updates }))
    }

    try {
      if (db) {
        const userRef = doc(db, 'users', user.uid)
        // Attempt to save to Firestore with a timeout
        // If it takes too long, we proceed anyway (offline mode behavior)
        const savePromise = setDoc(userRef, updates, { merge: true })
        
        // Race against a 3-second timeout
        await Promise.race([
          savePromise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
        ]).catch(err => {
          console.warn('Firestore save timed out or failed, proceeding locally:', err)
          // We don't block navigation on save failure
        })
      } else {
        console.error('Firestore not initialized, skipping save')
      }
      
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Unexpected error in onboarding:', error)
      // Even if something explodes, try to navigate
      navigate('/', { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fullpage-center">
      <div className="card" style={{ maxWidth: 520, width: '92%' }}>
        <p className="section-title">Welcome</p>
        <h2 style={{ marginTop: 4, marginBottom: 8 }}>Set up your workspace</h2>
        <p style={{ marginTop: 0, marginBottom: 20, color: '#9ca3af' }}>
          A couple of quick preferences so the planner fits how you study.
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
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={{ fontSize: 14 }}>
            Study focus
            <input
              className="input"
              type="text"
              placeholder="Example: Finals week, Coding interview prep, Language exam"
              value={primaryGoal}
              onChange={event => setPrimaryGoal(event.target.value)}
            />
          </label>
          <label style={{ fontSize: 14 }}>
            Default focus block (minutes)
            <input
              className="input"
              type="number"
              min="10"
              max="120"
              value={defaultFocusMinutes}
              onChange={event => setDefaultFocusMinutes(event.target.value)}
            />
          </label>
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Enter dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default OnboardingPage

