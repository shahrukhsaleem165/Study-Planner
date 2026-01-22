# Study Planner & Focus Tracker

A minimal, production-ready Study Planner and Focus Tracker built with React, Firebase and Chart.js.

## Stack

- React (functional components + hooks)
- Vite
- Firebase Authentication (Google)
- Cloud Firestore
- Chart.js + react-chartjs-2
- Firebase Hosting

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Firebase project in the Firebase console and enable:

   - Google authentication provider
   - Cloud Firestore (in production or test mode, then apply the rules from `firestore.rules`)

3. Create a web app in Firebase and copy the config values.

4. Create a `.env` file in the project root based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Fill in the values from your Firebase project.

5. Start the dev server:

   ```bash
   npm run dev
   ```

6. Build for production:

   ```bash
   npm run build
   ```

## Firebase Hosting

1. Install the Firebase CLI globally if you have not already:

   ```bash
   npm install -g firebase-tools
   ```

2. Log in and select your project:

   ```bash
   firebase login
   firebase use your-firebase-project-id
   ```

3. Deploy hosting:

   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## Firestore data model

- `users/{userId}`
  - profile fields stored on the user document (onboarding, preferences)
  - `subjects/{subjectId}`
  - `tasks/{taskId}`
  - `sessions/{sessionId}`

