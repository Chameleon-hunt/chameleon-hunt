---
name: Firebase Auth Setup — Chameleon Hunt
description: Firebase config, auth requirements, and Firestore structure for the Chameleon Hunt game.
---

# Firebase Auth Setup

## Files
- `artifacts/chameleon-hunt/src/lib/firebase.ts` — app init, exports `auth` and `db`
- `artifacts/chameleon-hunt/src/lib/auth.tsx` — `AuthProvider`, `useAuth()` hook
- `artifacts/chameleon-hunt/src/components/AuthPage.tsx` — full-screen login/signup UI
- `artifacts/chameleon-hunt/src/components/UsernameModal.tsx` — username picker for new users
- `artifacts/chameleon-hunt/src/components/UserMenu.tsx` — profile dropdown in navbar
- `artifacts/chameleon-hunt/src/components/GoogleButton.tsx` — custom olive-green game-style Google button

## Firestore schema
- `users/{uid}` → `{ uid, username, email, photoURL, createdAt, loginMethod, xp, foundIds }`
- `usernames/{username_lowercase}` → `{ uid, createdAt }` (for uniqueness enforcement via transaction)

## Auth flow
1. App loads → `loading=true` → spinner
2. Not logged in → `AuthPage` (full screen)
3. Logged in, no Firestore profile → `UsernameModal` (Google first-time or new email signup)
4. Logged in + profile → normal app
5. `foundIds` synced from Firestore on login, written back on each "Found It!"

## Required Firebase console steps (for the user to complete)
- Enable **Google** and **Email/Password** sign-in methods in Firebase Auth
- Add authorized domains: Replit dev domain (`*.replit.dev`) + production domain
- Firestore started in **test mode** — update rules before going to production

## Secrets (stored as Replit Secrets with VITE_ prefix)
VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID,
VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID

**Why:** Vite dev server must be restarted after secrets are first added to pick them up.
