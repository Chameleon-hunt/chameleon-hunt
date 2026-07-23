import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { GoogleButton } from './GoogleButton';
import { LogoMark } from '../Home';

type Tab = 'signin' | 'signup';

function parseFirebaseError(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please allow popups for this site.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

function GameInput({
  type,
  placeholder,
  value,
  onChange,
  icon,
  rightSlot,
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.05)',
        border: '1.5px solid rgba(255,255,255,0.12)',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <span style={{ position: 'absolute', left: 14, color: 'rgba(255,255,255,0.35)', display: 'flex' }}>
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'white',
          fontFamily: "'Outfit', sans-serif",
          fontSize: '0.95rem',
          padding: '13px 14px 13px 44px',
        }}
      />
      {rightSlot && (
        <span style={{ position: 'absolute', right: 12, display: 'flex', cursor: 'pointer' }}>
          {rightSlot}
        </span>
      )}
    </div>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        borderRadius: 10,
        background: 'rgba(255,45,85,0.12)',
        border: '1px solid rgba(255,45,85,0.35)',
        color: '#ff6b8a',
        fontSize: '0.85rem',
        fontWeight: 600,
      }}
    >
      <AlertCircle size={15} style={{ flexShrink: 0 }} />
      {msg}
    </motion.div>
  );
}

export function AuthPage({ onBack, initialTab }: { onBack?: () => void; initialTab?: Tab }) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [tab, setTab] = useState<Tab>(initialTab ?? 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const handleGoogle = async () => {
    setGoogleBusy(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(parseFirebaseError(err.code));
    } finally {
      setGoogleBusy(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setBusy(true);
    setError('');
    try {
      if (tab === 'signin') {
        await signInWithEmail(email.trim(), password);
      } else {
        await signUpWithEmail(email.trim(), password);
      }
    } catch (err: any) {
      setError(parseFirebaseError(err.code));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#08081a', fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            opacity: 0.3,
          }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(4,4,16,0.85) 0%, rgba(4,4,16,0.92) 100%)' }} />
      </div>

      {/* Colour blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: -60, left: -80, width: 340, height: 280, background: '#FF2D55', borderRadius: '50%', filter: 'blur(90px)', opacity: 0.08 }} />
        <div style={{ position: 'absolute', bottom: -40, right: -60, width: 380, height: 300, background: '#0080FF', borderRadius: '50%', filter: 'blur(90px)', opacity: 0.08 }} />
        <div style={{ position: 'absolute', top: '40%', left: '60%', width: 260, height: 220, background: '#39FF14', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.05 }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 420 }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <LogoMark size="lg" />
        </div>

        {/* Card */}
        <div
          style={{
            background: 'rgba(10,10,26,0.92)',
            border: '1.5px solid rgba(255,255,255,0.10)',
            borderRadius: 24,
            padding: '32px 28px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Headline */}
          <h2
            style={{
              fontFamily: "'Righteous', sans-serif",
              fontSize: '1.6rem',
              fontWeight: 900,
              color: 'white',
              marginBottom: 4,
              textAlign: 'center',
            }}
          >
            {tab === 'signin' ? 'Welcome Back, Hunter' : 'Join the Hunt'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', textAlign: 'center', marginBottom: 24 }}>
            {tab === 'signin' ? 'Sign in to track your progress' : 'Create your hunter account'}
          </p>

          {/* Tab switcher */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              padding: 4,
              marginBottom: 22,
              gap: 4,
            }}
          >
            {(['signin', 'signup'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 8,
                  fontFamily: "'Righteous', sans-serif",
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  transition: 'all 0.2s',
                  background: tab === t ? 'rgba(255,107,0,0.2)' : 'transparent',
                  color: tab === t ? '#FF6B00' : 'rgba(255,255,255,0.45)',
                  border: tab === t ? '1px solid rgba(255,107,0,0.4)' : '1px solid transparent',
                }}
              >
                {t === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Google button */}
          <div style={{ marginBottom: 20 }}>
            <GoogleButton onClick={handleGoogle} loading={googleBusy} />
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <GameInput
              type="email"
              placeholder="Email address"
              value={email}
              onChange={setEmail}
              icon={<Mail size={16} />}
            />
            <GameInput
              type={showPw ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={setPassword}
              icon={<Lock size={16} />}
              rightSlot={
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ color: 'rgba(255,255,255,0.35)', display: 'flex' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <AnimatePresence>
              {error && <ErrorBanner msg={error} />}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={busy || !email || !password}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: 12,
                fontFamily: "'Righteous', sans-serif",
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: 'white',
                background: busy || !email || !password
                  ? 'rgba(255,107,0,0.3)'
                  : 'linear-gradient(135deg, #ff6b00 0%, #d45500 100%)',
                border: '1px solid rgba(255,107,0,0.4)',
                boxShadow: busy || !email || !password ? 'none' : '0 6px 24px rgba(255,107,0,0.35)',
                cursor: busy || !email || !password ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {busy ? 'Please wait…' : tab === 'signin' ? 'Sign In' : 'Create Account'}
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>
            By continuing, you agree to our rules and fair play policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
