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

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !db) {
      setTasks([])
      setLoading(false)
      return
    }

    // Safety timeout
    const safetyTimeout = setTimeout(() => {
      setLoading(prev => {
        if (prev) {
          console.warn('Tasks loading timed out')
          return false
        }
        return prev
      })
    }, 5000)

    let unsubscribe

    try {
      const tasksRef = collection(db, 'users', user.uid, 'tasks')
      const q = query(tasksRef, orderBy('deadline', 'asc'))

      unsubscribe = onSnapshot(q, snapshot => {
        const items = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
        setTasks(items)
        setLoading(false)
      }, error => {
        console.error('Error fetching tasks:', error)
        setLoading(false)
      })
    } catch (err) {
      console.error('Error setting up tasks listener:', err)
      setLoading(false)
    }

    return () => {
      clearTimeout(safetyTimeout)
      if (unsubscribe) unsubscribe()
    }
  }, [user])

  const addTask = async payload => {
    if (!user || !db) return

    // Optimistic update
    const tempId = Date.now().toString()
    const newTask = {
      id: tempId,
      title: payload.title,
      subjectId: payload.subjectId || null,
      deadline: payload.deadline ? new Date(payload.deadline).toISOString() : null,
      completed: false,
      createdAt: new Date(),
      pending: true
    }

    setTasks(prev => [...prev, newTask])

    try {
      const tasksRef = collection(db, 'users', user.uid, 'tasks')
      await addDoc(tasksRef, {
        title: payload.title,
        subjectId: payload.subjectId || null,
        deadline: payload.deadline ? new Date(payload.deadline).toISOString() : null,
        completed: false,
        createdAt: new Date(), // Use client time to avoid pending write issues
      })
    } catch (error) {
      console.error('Error adding task:', error)
      setTasks(prev => prev.filter(t => t.id !== tempId))
      throw error
    }
  }

  const toggleTaskCompletion = async (id, completed) => {
    if (!user) return
    const taskRef = doc(db, 'users', user.uid, 'tasks', id)
    await updateDoc(taskRef, {
      completed,
      completedAt: completed ? serverTimestamp() : null,
    })
  }

  const deleteTask = async id => {
    if (!user) return
    const taskRef = doc(db, 'users', user.uid, 'tasks', id)
    await deleteDoc(taskRef)
  }

  return {
    tasks,
    loading,
    addTask,
    toggleTaskCompletion,
    deleteTask,
  }
}

