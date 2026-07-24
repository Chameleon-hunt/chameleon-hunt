import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowLeft, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { LogoMark } from '../Home';

export type Tab = 'signin' | 'signup';

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
    default:
      return 'Something went wrong. Please try again.';
  }
}

// ── Floating-label input ────────────────────────────────────────────────────
function FloatingInput({
  id,
  type,
  label,
  value,
  onChange,
  icon,
  accentColor = '#FF6B00',
  rightSlot,
}: {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  accentColor?: string;
  rightSlot?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'relative',
          background: focused
            ? 'rgba(255,255,255,0.06)'
            : 'rgba(255,255,255,0.03)',
          border: `1.5px solid ${
            focused ? accentColor + 'bb' : 'rgba(255,255,255,0.1)'
          }`,
          borderRadius: 14,
          transition: 'all 0.22s ease',
          boxShadow: focused ? `0 0 0 3px ${accentColor}18` : 'none',
        }}
      >
        {/* Icon */}
        <span
          style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: focused ? accentColor : 'rgba(255,255,255,0.3)',
            display: 'flex',
            transition: 'color 0.22s',
            zIndex: 2,
          }}
        >
          {icon}
        </span>

        {/* Floating label */}
        <label
          htmlFor={id}
          style={{
            position: 'absolute',
            left: 48,
            top: lifted ? 8 : '50%',
            transform: lifted ? 'translateY(0) scale(0.78)' : 'translateY(-50%)',
            transformOrigin: 'left center',
            color: lifted
              ? focused
                ? accentColor
                : 'rgba(255,255,255,0.45)'
              : 'rgba(255,255,255,0.38)',
            fontSize: '0.95rem',
            fontWeight: 500,
            pointerEvents: 'none',
            transition: 'all 0.22s ease',
            zIndex: 2,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </label>

        {/* Input */}
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'white',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.97rem',
            fontWeight: 500,
            padding: lifted ? '24px 48px 10px 48px' : '18px 48px 18px 48px',
            letterSpacing: '0.01em',
            transition: 'padding 0.22s ease',
          }}
        />

        {rightSlot && (
          <span
            style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            {rightSlot}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Error banner ─────────────────────────────────────────────────────────────
function ErrorBanner({ msg }: { msg: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.97 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '11px 16px',
        borderRadius: 12,
        background: 'rgba(255,45,85,0.1)',
        border: '1px solid rgba(255,45,85,0.3)',
        color: '#ff7a96',
        fontSize: '0.85rem',
        fontWeight: 600,
        lineHeight: 1.4,
      }}
    >
      <AlertCircle size={15} style={{ flexShrink: 0 }} />
      {msg}
    </motion.div>
  );
}

// ── Main AuthPage ─────────────────────────────────────────────────────────────
export function AuthPage({ onBack, initialTab }: { onBack?: () => void; initialTab?: Tab }) {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [tab, setTab] = useState<Tab>(initialTab ?? 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const switchTab = (t: Tab) => {
    setTab(t);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPw('');
  };

  const canSubmit =
    email.trim().length > 0 &&
    password.length >= 6 &&
    (tab === 'signin' || password === confirmPw);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || busy) return;
    if (tab === 'signup' && password !== confirmPw) {
      setError('Passwords do not match.');
      return;
    }
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

  const isSignUp = tab === 'signup';
  const accent = isSignUp ? '#39FF14' : '#FF6B00';
  const accentDim = isSignUp ? 'rgba(57,255,20,0.18)' : 'rgba(255,107,0,0.18)';
  const accentBorder = isSignUp ? 'rgba(57,255,20,0.4)' : 'rgba(255,107,0,0.4)';
  const btnGradient = isSignUp
    ? 'linear-gradient(135deg, #39FF14 0%, #00b800 100%)'
    : 'linear-gradient(135deg, #FF6B00 0%, #d45500 100%)';
  const btnGlow = isSignUp
    ? '0 8px 32px rgba(57,255,20,0.45)'
    : '0 8px 32px rgba(255,107,0,0.45)';

  return (
    <div
      className="min-h-[100dvh] flex flex-col relative overflow-hidden"
      style={{ background: '#08081a', fontFamily: "'Outfit', sans-serif" }}
    >
      {/* City background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            opacity: 0.18,
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(4,4,16,0.9), rgba(4,4,16,0.97))' }}
        />
      </div>

      {/* Colour blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.07, 0.1, 0.07] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: -80, left: -100, width: 480, height: 380, background: isSignUp ? '#39FF14' : '#FF2D55', borderRadius: '50%', filter: 'blur(110px)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.06, 0.09, 0.06] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ position: 'absolute', bottom: -60, right: -80, width: 440, height: 360, background: '#0080FF', borderRadius: '50%', filter: 'blur(100px)' }}
        />
      </div>

      {/* Back button */}
      {onBack && (
        <div style={{ position: 'relative', zIndex: 30, padding: '18px 20px 0' }}>
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              color: 'rgba(255,255,255,0.5)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              padding: '7px 14px',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>
      )}

      {/* Centred card */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-5">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: 440 }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <LogoMark size="lg" />
          </div>

          {/* Glass card */}
          <div
            style={{
              background: 'rgba(10,10,26,0.88)',
              border: '1.5px solid rgba(255,255,255,0.09)',
              borderRadius: 24,
              padding: '36px 32px 32px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.75)',
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* Tab pills */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14,
                padding: 5,
                marginBottom: 28,
                gap: 5,
              }}
            >
              {(['signin', 'signup'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => switchTab(t)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 7,
                    padding: '10px 0',
                    borderRadius: 10,
                    fontFamily: "'Righteous', sans-serif",
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    transition: 'all 0.22s ease',
                    cursor: 'pointer',
                    border: 'none',
                    background: tab === t ? accentDim : 'transparent',
                    color: tab === t ? accent : 'rgba(255,255,255,0.38)',
                    boxShadow: tab === t ? `inset 0 0 0 1px ${accentBorder}` : 'none',
                  }}
                >
                  {t === 'signin' ? <LogIn size={13} /> : <UserPlus size={13} />}
                  {t === 'signin' ? 'SIGN IN' : 'SIGN UP'}
                </button>
              ))}
            </div>

            {/* Heading */}
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                style={{ marginBottom: 24, textAlign: 'center' }}
              >
                <h2
                  style={{
                    fontFamily: "'Righteous', sans-serif",
                    fontSize: '1.55rem',
                    fontWeight: 900,
                    color: 'white',
                    marginBottom: 5,
                  }}
                >
                  {isSignUp ? 'Join the Hunt' : 'Welcome Back, Hunter'}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                  {isSignUp
                    ? 'Create your account to start hunting'
                    : 'Sign in to track your progress'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <FloatingInput
                id="auth-email"
                type="email"
                label="Email address"
                value={email}
                onChange={setEmail}
                icon={<Mail size={17} />}
                accentColor={accent}
              />

              <FloatingInput
                id="auth-password"
                type={showPw ? 'text' : 'password'}
                label="Password"
                value={password}
                onChange={setPassword}
                icon={<Lock size={17} />}
                accentColor={accent}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              <AnimatePresence>
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <FloatingInput
                      id="auth-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      label="Confirm password"
                      value={confirmPw}
                      onChange={setConfirmPw}
                      icon={<Lock size={17} />}
                      accentColor={accent}
                      rightSlot={
                        <button
                          type="button"
                          onClick={() => setShowConfirm(v => !v)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
                          tabIndex={-1}
                        >
                          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      }
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Inline password hint for sign-up */}
              <AnimatePresence>
                {isSignUp && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      color: 'rgba(255,255,255,0.28)',
                      fontSize: '0.76rem',
                      marginTop: -6,
                      paddingLeft: 4,
                    }}
                  >
                    Min. 6 characters · passwords must match
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && <ErrorBanner msg={error} />}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={!canSubmit || busy}
                whileHover={canSubmit && !busy ? { scale: 1.025, y: -1 } : {}}
                whileTap={canSubmit && !busy ? { scale: 0.97 } : {}}
                style={{
                  width: '100%',
                  marginTop: 4,
                  padding: '15px',
                  borderRadius: 14,
                  fontFamily: "'Righteous', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  color: canSubmit && !busy ? (isSignUp ? '#071a00' : '#fff') : 'rgba(255,255,255,0.3)',
                  background: canSubmit && !busy ? btnGradient : 'rgba(255,255,255,0.06)',
                  border: canSubmit && !busy ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: canSubmit && !busy ? btnGlow : 'none',
                  cursor: canSubmit && !busy ? 'pointer' : 'not-allowed',
                  transition: 'background 0.22s, box-shadow 0.22s, color 0.22s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                {busy ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }}
                    />
                    Please wait…
                  </>
                ) : (
                  <>
                    {isSignUp ? <UserPlus size={16} /> : <LogIn size={16} />}
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer note */}
            <p
              style={{
                textAlign: 'center',
                marginTop: 20,
                color: 'rgba(255,255,255,0.22)',
                fontSize: '0.75rem',
                lineHeight: 1.5,
              }}
            >
              By continuing, you agree to our rules and fair play policy.
            </p>
          </div>

          {/* Switch tab hint below card */}
          <p style={{ textAlign: 'center', marginTop: 18, color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' }}>
            {isSignUp ? 'Already a hunter?' : "Don't have an account?"}
            {' '}
            <button
              onClick={() => switchTab(isSignUp ? 'signin' : 'signup')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: accent,
                fontWeight: 700,
                fontSize: '0.82rem',
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
