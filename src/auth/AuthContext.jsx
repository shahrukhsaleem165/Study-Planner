import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, db, googleProvider } from '../firebase'
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false)
      return undefined
    }

    // Failsafe: Turn off loading after 5 seconds max
    const safetyTimeout = setTimeout(() => {
      setLoading(prev => {
        if (prev) {
          console.warn('Auth loading timed out, forcing render')
          return false
        }
        return prev
      })
    }, 5000)

    let unsubscribeProfile

    const unsubscribeAuth = onAuthStateChanged(auth, async firebaseUser => {
      if (!firebaseUser) {
        if (unsubscribeProfile) {
          unsubscribeProfile()
          unsubscribeProfile = undefined
        }
        setUser(null)
        setProfile(null)
        setLoading(false)
        return
      }

      setUser(firebaseUser)

      const userRef = doc(db, 'users', firebaseUser.uid)

      unsubscribeProfile = onSnapshot(userRef, async snap => {
        if (!snap.exists()) {
          const baseProfile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
            onboarded: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
          try {
             await setDoc(userRef, baseProfile, { merge: true })
          } catch (err) {
            console.error('Error creating user profile:', err)
          }
        } else {
          setProfile(snap.data())
        }
        setLoading(false)
      }, error => {
        console.error('Firestore snapshot error:', error)
        setLoading(false)
      })
    })

    return () => {
      clearTimeout(safetyTimeout)
      if (unsubscribeProfile) {
        unsubscribeProfile()
      }
      unsubscribeAuth()
    }
  }, [])

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      console.error('Firebase Auth is not configured. Check your .env Firebase variables.')
      return
    }
    await signInWithPopup(auth, googleProvider)
  }

  const logout = () => signOut(auth)

  const value = useMemo(
    () => ({
      user,
      profile,
      setProfile,
      loading,
      signInWithGoogle,
      logout,
    }),
    [user, profile, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
