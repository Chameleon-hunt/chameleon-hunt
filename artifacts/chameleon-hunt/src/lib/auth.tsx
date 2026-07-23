import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  photoURL: string | null;
  createdAt: any;
  loginMethod: 'google' | 'email';
  xp: number;
  foundIds: number[];
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  needsUsername: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createUsername: (username: string) => Promise<{ error?: string }>;
  markFound: (figId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

function getLocalFound(): number[] {
  try { return JSON.parse(localStorage.getItem('chameleon_hunt_found') ?? '[]'); }
  catch { return []; }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (uid: string): Promise<UserProfile | null> => {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      setProfile(data);
      return data;
    }
    setProfile(null);
    return null;
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await loadProfile(u.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [loadProfile]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // onAuthStateChanged will fire and load profile
    await loadProfile(result.user.uid);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged handles the rest
  };

  const signUpWithEmail = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
    // profile will be null → needsUsername = true
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  const createUsername = async (username: string): Promise<{ error?: string }> => {
    if (!user) return { error: 'Not logged in.' };

    const trimmed = username.trim();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(trimmed)) {
      return { error: 'Username must be 3–20 characters: letters, numbers, underscores only.' };
    }

    const lower = trimmed.toLowerCase();

    try {
      await runTransaction(db, async (tx) => {
        const unameRef = doc(db, 'usernames', lower);
        const unameSnap = await tx.get(unameRef);
        if (unameSnap.exists()) throw new Error('USERNAME_TAKEN');

        const localFound = getLocalFound();
        const loginMethod: 'google' | 'email' =
          user.providerData[0]?.providerId === 'google.com' ? 'google' : 'email';

        const profileData: Omit<UserProfile, 'createdAt'> & { createdAt: any } = {
          uid: user.uid,
          username: trimmed,
          email: user.email ?? '',
          photoURL: user.photoURL ?? null,
          createdAt: serverTimestamp(),
          loginMethod,
          xp: localFound.length * 100,
          foundIds: localFound,
        };

        tx.set(doc(db, 'users', user.uid), profileData);
        tx.set(unameRef, { uid: user.uid, createdAt: serverTimestamp() });
      });

      await loadProfile(user.uid);
      return {};
    } catch (err: any) {
      if (err.message === 'USERNAME_TAKEN') {
        return { error: 'That username is already taken. Try another one.' };
      }
      return { error: 'Something went wrong. Please try again.' };
    }
  };

  const markFound = async (figId: number) => {
    if (!user) return;

    const localFound = getLocalFound();
    const next = [...new Set([...localFound, figId])];
    localStorage.setItem('chameleon_hunt_found', JSON.stringify(next));

    if (profile) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          foundIds: arrayUnion(figId),
          xp: next.length * 100,
        });
        setProfile(prev =>
          prev ? { ...prev, foundIds: next, xp: next.length * 100 } : prev
        );
      } catch (_) {
        // Firestore update failed silently; localStorage already updated
      }
    }
  };

  const needsUsername = !loading && user !== null && profile === null;

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      needsUsername,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      logout,
      createUsername,
      markFound,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
