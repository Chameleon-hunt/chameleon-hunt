import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, AtSign } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { LogoMark } from '../Home';

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

function validate(u: string): string {
  if (u.length < 3) return 'At least 3 characters required.';
  if (u.length > 20) return 'Maximum 20 characters.';
  if (!/^[a-zA-Z0-9_]+$/.test(u)) return 'Only letters, numbers, and underscores.';
  return '';
}

export function UsernameModal() {
  const { createUsername, profile, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [localError, setLocalError] = useState('');

  const handleChange = (val: string) => {
    setUsername(val);
    setLocalError(val ? validate(val) : '');
    setError('');
  };

  const isValid = USERNAME_REGEX.test(username);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || busy) return;
    setBusy(true);
    setError('');
    const result = await createUsername(username);
    if (result.error) {
      setError(result.error);
      setBusy(false);
    }
    // On success, profile will be set by auth context → modal unmounts automatically
  };

  const displayErr = error || localError;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden"
      style={{ background: '#08081a', fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: -60, left: -80, width: 340, height: 280, background: '#FFE600', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.07 }} />
        <div style={{ position: 'absolute', bottom: -40, right: -60, width: 380, height: 300, background: '#39FF14', borderRadius: '50%', filter: 'blur(90px)', opacity: 0.07 }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
        style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 420 }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-7">
          <LogoMark size="lg" />
        </div>

        {/* Card */}
        <div
          style={{
            background: 'rgba(10,10,26,0.96)',
            border: '1.5px solid rgba(255,255,255,0.10)',
            borderRadius: 24,
            padding: '32px 28px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
          }}
        >
          {/* Icon badge */}
          <div className="flex justify-center mb-4">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFE600, #FF6B00)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(255,230,0,0.3)',
              }}
            >
              <AtSign size={28} color="#1a0a00" strokeWidth={2.5} />
            </div>
          </div>

          <h2
            style={{
              fontFamily: "'Righteous', sans-serif",
              fontSize: '1.55rem',
              color: 'white',
              textAlign: 'center',
              marginBottom: 6,
            }}
          >
            Choose Your Hunter Name
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '0.85rem',
              textAlign: 'center',
              marginBottom: 24,
              lineHeight: 1.5,
            }}
          >
            This name is permanent and cannot be changed.
            Make it yours — hunters will see it on the leaderboard.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Username input */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${displayErr ? 'rgba(255,45,85,0.5)' : isValid ? 'rgba(57,255,20,0.45)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: 12,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                <span style={{ paddingLeft: 14, color: 'rgba(255,255,255,0.35)', flexShrink: 0, fontSize: '0.9rem', fontWeight: 700 }}>
                  @
                </span>
                <input
                  type="text"
                  placeholder="your_username"
                  value={username}
                  onChange={e => handleChange(e.target.value)}
                  maxLength={20}
                  autoFocus
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'white',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 600,
                    padding: '13px 44px 13px 8px',
                    letterSpacing: '0.02em',
                  }}
                />
                {isValid && (
                  <span style={{ position: 'absolute', right: 14, color: '#39FF14' }}>
                    <Check size={16} />
                  </span>
                )}
              </div>

              {/* Character counter */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, paddingInline: 4 }}>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>
                  Letters, numbers, underscores · 3–20 chars
                </span>
                <span style={{ color: username.length > 20 ? '#FF2D55' : 'rgba(255,255,255,0.3)', fontSize: '0.72rem', fontWeight: 700 }}>
                  {username.length}/20
                </span>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {displayErr && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'rgba(255,45,85,0.1)',
                    border: '1px solid rgba(255,45,85,0.3)',
                    color: '#ff6b8a',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  {displayErr}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={!isValid || busy}
              whileHover={isValid && !busy ? { scale: 1.02 } : {}}
              whileTap={isValid && !busy ? { scale: 0.97 } : {}}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                fontFamily: "'Righteous', sans-serif",
                fontSize: '1.05rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: !isValid || busy ? 'rgba(255,255,255,0.35)' : '#1a0a00',
                background: !isValid || busy
                  ? 'rgba(255,230,0,0.2)'
                  : 'linear-gradient(135deg, #ffe600 0%, #ffb300 100%)',
                border: '1px solid rgba(255,230,0,0.4)',
                boxShadow: !isValid || busy ? 'none' : '0 6px 24px rgba(255,200,0,0.35)',
                cursor: !isValid || busy ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: 4,
              }}
            >
              {busy ? 'Saving…' : 'Claim Username →'}
            </motion.button>
          </form>

          {/* Sign out link */}
          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <button
              onClick={logout}
              style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Use a different account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
