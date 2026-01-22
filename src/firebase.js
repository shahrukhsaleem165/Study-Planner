import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB0mTe1j0BaJVW_Hg-_PoPTYBf-wiSFkBM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "study-planner-4ea28.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "study-planner-4ea28",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "study-planner-4ea28.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1015022262275",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1015022262275:web:6dc6c86fa43ace00ff5636",
}

let app
let authInstance = null
let dbInstance = null
let googleAuthProvider = null

try {
  app = initializeApp(firebaseConfig)
  authInstance = getAuth(app)
  dbInstance = getFirestore(app)
  googleAuthProvider = new GoogleAuthProvider()
} catch (error) {
  console.error('Failed to initialize Firebase. Check your .env Firebase config.', error)
}

export const auth = authInstance
export const googleProvider = googleAuthProvider
export const db = dbInstance

export default app
