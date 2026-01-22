import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../auth/AuthContext'

export function useSubjects() {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !db) {
      setSubjects([])
      setLoading(false)
      return
    }

    // Safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      setLoading(prev => {
        if (prev) {
          console.warn('Subjects loading timed out')
          return false
        }
        return prev
      })
    }, 5000)

    let unsubscribe

    try {
      const subjectsRef = collection(db, 'users', user.uid, 'subjects')
      const q = query(subjectsRef, orderBy('createdAt', 'asc'))

      unsubscribe = onSnapshot(q, snapshot => {
        const items = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
        setSubjects(items)
        setLoading(false)
      }, error => {
        console.error('Error fetching subjects:', error)
        setLoading(false)
      })
    } catch (err) {
      console.error('Error setting up subjects listener:', err)
      setLoading(false)
    }

    return () => {
      clearTimeout(safetyTimeout)
      if (unsubscribe) unsubscribe()
    }
  }, [user])

  const addSubject = async name => {
    if (!user || !db) return
    
    // Optimistic update
    const tempId = Date.now().toString()
    const newSubject = {
      id: tempId,
      name,
      color: '#22c55e',
      createdAt: new Date(), // Local date for immediate display
      pending: true
    }
    
    setSubjects(prev => [...prev, newSubject])
    
    try {
      const subjectsRef = collection(db, 'users', user.uid, 'subjects')
      await addDoc(subjectsRef, {
        name,
        color: '#22c55e',
        createdAt: new Date(), // Use client time to ensure immediate visibility in ordered queries
      })
    } catch (error) {
      console.error('Error adding subject:', error)
      // Revert on failure
      setSubjects(prev => prev.filter(s => s.id !== tempId))
      throw error
    }
  }

  const updateSubject = async (id, updates) => {
    if (!user) return
    const subjectRef = doc(db, 'users', user.uid, 'subjects', id)
    await updateDoc(subjectRef, updates)
  }

  const deleteSubject = async id => {
    if (!user) return
    const subjectRef = doc(db, 'users', user.uid, 'subjects', id)
    await deleteDoc(subjectRef)
  }

  return {
    subjects,
    loading,
    addSubject,
    updateSubject,
    deleteSubject,
  }
}

