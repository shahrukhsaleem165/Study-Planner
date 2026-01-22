import React, { useEffect, useRef, useState } from 'react'
import { useSubjects } from '../../hooks/useSubjects'
import { useSessions } from '../../hooks/useSessions'

const PRESETS = [15, 25, 45, 60]

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function FocusTimer() {
  const { subjects, addSubject } = useSubjects()
  const { logSession } = useSessions()
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [durationMinutes, setDurationMinutes] = useState(25)
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const startTimeRef = useRef(null)
  const intervalRef = useRef(null)

  const handleSubjectChange = async event => {
    const value = event.target.value
    if (value === 'new') {
      const name = prompt('Enter new subject name:')
      if (name && name.trim()) {
        try {
          await addSubject(name.trim())
        } catch (error) {
          alert('Failed to create subject')
        }
      }
      setSelectedSubjectId('')
    } else {
      setSelectedSubjectId(value)
    }
  }

  useEffect(() => {
    setRemainingSeconds(durationMinutes * 60)
  }, [durationMinutes])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startTimer = () => {
    if (isRunning) return
    const now = new Date()
    startTimeRef.current = now
    setIsRunning(true)

    const initialSeconds = remainingSeconds

    intervalRef.current = window.setInterval(() => {
      const elapsedSeconds = Math.floor((new Date().getTime() - now.getTime()) / 1000)
      const nextRemaining = initialSeconds - elapsedSeconds

      if (nextRemaining <= 0) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
        setIsRunning(false)
        setRemainingSeconds(0)
        const endTime = new Date()
        const durationMinutesComplete = Math.round(initialSeconds / 60)
        logSession({
          subjectId: selectedSubjectId || null,
          startTime: startTimeRef.current || now,
          endTime,
          durationMinutes: durationMinutesComplete,
        })
        setTimeout(() => {
          setRemainingSeconds(durationMinutes * 60)
        }, 500)
        return
      }

      setRemainingSeconds(nextRemaining)
    }, 1000)
  }

  const pauseTimer = () => {
    if (!isRunning) return
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
  }

  const resetTimer = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    setRemainingSeconds(durationMinutes * 60)
    startTimeRef.current = null
  }

  const progress = 1 - remainingSeconds / (durationMinutes * 60 || 1)

  return (
    <div className="card">
      <div style={{ marginBottom: 8 }}>
        <p className="section-title" style={{ marginBottom: 6 }}>
          Focus timer
        </p>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            border: '6px solid rgba(31,41,55,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 6,
              borderRadius: '50%',
              background:
                'conic-gradient(from 270deg, #22c55e ' +
                progress * 360 +
                'deg, rgba(15,23,42,0.9) ' +
                progress * 360 +
                'deg)',
              opacity: 0.9,
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              background: 'rgba(15,23,42,0.96)',
              borderRadius: '50%',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: 28, fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(remainingSeconds)}
            </div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>
              {isRunning ? 'Deep focus' : 'Ready'}
            </div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ fontSize: 13 }}>
            Subject
            <select
              className="input"
              value={selectedSubjectId}
              onChange={handleSubjectChange}
            >
              <option value="">General focus</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
              <option value="new" style={{ fontWeight: 'bold', color: '#22c55e' }}>
                + Create new subject
              </option>
            </select>
          </label>
          <label style={{ fontSize: 13 }}>
            Duration (minutes)
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              {PRESETS.map(minutes => (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => {
                    setDurationMinutes(minutes)
                    setRemainingSeconds(minutes * 60)
                  }}
                  style={{
                    flex: 1,
                    borderRadius: 999,
                    border:
                      durationMinutes === minutes
                        ? '1px solid rgba(34,197,94,0.9)'
                        : '1px solid rgba(55,65,81,0.9)',
                    background:
                      durationMinutes === minutes ? 'rgba(22,163,74,0.18)' : 'transparent',
                    color: '#e5e7eb',
                    fontSize: 12,
                    padding: '6px 0',
                    cursor: 'pointer',
                  }}
                >
                  {minutes}m
                </button>
              ))}
              <input
                className="input"
                type="number"
                min="5"
                max="180"
                value={durationMinutes}
                onChange={event => {
                  const next = Number(event.target.value) || 0
                  setDurationMinutes(next)
                  setRemainingSeconds(next * 60)
                }}
                style={{ maxWidth: 80 }}
              />
            </div>
          </label>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            {!isRunning ? (
              <button className="primary-button" type="button" onClick={startTimer}>
                Start
              </button>
            ) : (
              <button
                className="primary-button"
                type="button"
                onClick={pauseTimer}
                style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
              >
                Pause
              </button>
            )}
            <button
              type="button"
              onClick={resetTimer}
              style={{
                borderRadius: 999,
                border: '1px solid rgba(148,163,184,0.6)',
                padding: '8px 14px',
                background: 'transparent',
                color: '#9ca3af',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
        Completed blocks are saved as focus sessions and power your analytics.
      </p>
    </div>
  )
}

export default FocusTimer

