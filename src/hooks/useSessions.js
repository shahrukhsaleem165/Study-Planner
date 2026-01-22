import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../auth/AuthContext'

export function useSessions(daysWindow = 30) {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !db) {
      setSessions([])
      setLoading(false)
      return
    }

    // Safety timeout
    const safetyTimeout = setTimeout(() => {
      setLoading(prev => {
        if (prev) {
          console.warn('Sessions loading timed out')
          return false
        }
        return prev
      })
    }, 5000)

    let unsubscribe

    try {
      const since = new Date()
      since.setDate(since.getDate() - daysWindow)

      const sessionsRef = collection(db, 'users', user.uid, 'sessions')
      const q = query(
        sessionsRef,
        where('startTime', '>=', since.toISOString()),
        orderBy('startTime', 'asc'),
      )

      unsubscribe = onSnapshot(q, snapshot => {
        const items = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
        setSessions(items)
        setLoading(false)
      }, error => {
        console.error('Error fetching sessions:', error)
        setLoading(false)
      })
    } catch (err) {
      console.error('Error setting up sessions listener:', err)
      setLoading(false)
    }

    return () => {
      clearTimeout(safetyTimeout)
      if (unsubscribe) unsubscribe()
    }
  }, [user, daysWindow])

  const logSession = async ({ subjectId, startTime, endTime, durationMinutes }) => {
    if (!user || !db) return
    const sessionsRef = collection(db, 'users', user.uid, 'sessions')
    
    try {
      await addDoc(sessionsRef, {
        subjectId: subjectId || null,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        durationMinutes,
        date: startTime.toISOString().slice(0, 10),
        createdAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error logging session:', error)
      throw error
    }
  }

  return {
    sessions,
    loading,
    logSession,
  }
}

