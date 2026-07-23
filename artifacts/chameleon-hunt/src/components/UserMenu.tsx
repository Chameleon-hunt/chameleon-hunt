import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Trophy, Star, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../lib/auth';

export function UserMenu() {
  const { profile, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (!profile) return null;

  const initials = profile.username.slice(0, 2).toUpperCase();
  const xp = profile.xp ?? (profile.foundIds?.length ?? 0) * 100;
  const found = profile.foundIds?.length ?? 0;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '4px 8px 4px 4px',
          borderRadius: 999,
          background: open ? 'rgba(255,107,0,0.18)' : 'rgba(255,255,255,0.08)',
          border: `1px solid ${open ? 'rgba(255,107,0,0.4)' : 'rgba(255,255,255,0.12)'}`,
          transition: 'all 0.18s',
          cursor: 'pointer',
        }}
      >
        {/* Avatar */}
        {profile.photoURL ? (
          <img
            src={profile.photoURL}
            alt={profile.username}
            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: 'white',
              fontWeight: 800,
              fontSize: '0.72rem',
              fontFamily: "'Righteous', sans-serif",
            }}
          >
            {initials}
          </div>
        )}

        {/* Username (hidden on very small screens) */}
        <span
          className="hidden sm:block"
          style={{
            color: open ? '#FF6B00' : 'rgba(255,255,255,0.85)',
            fontWeight: 700,
            fontSize: '0.82rem',
            fontFamily: "'Righteous', sans-serif",
            letterSpacing: '0.03em',
            maxWidth: 90,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {profile.username}
        </span>

        <ChevronDown
          size={13}
          style={{
            color: open ? '#FF6B00' : 'rgba(255,255,255,0.4)',
            transition: 'transform 0.18s',
            transform: open ? 'rotate(180deg)' : 'none',
          }}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              minWidth: 220,
              borderRadius: 16,
              overflow: 'hidden',
              background: 'rgba(10,10,26,0.98)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
              zIndex: 200,
            }}
          >
            {/* Profile header */}
            <div
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,107,0,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {profile.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt=""
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      fontFamily: "'Righteous', sans-serif",
                    }}
                  >
                    {initials}
                  </div>
                )}
                <div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', fontFamily: "'Righteous', sans-serif" }}>
                    @{profile.username}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', marginTop: 1 }}>
                    {profile.loginMethod === 'google' ? '🔵 Google account' : '📧 Email account'}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 12 }}>
              <StatPill icon={<Trophy size={13} />} label="Found" value={String(found)} color="#FFE600" />
              <StatPill icon={<Star size={13} />} label="XP" value={`${xp}`} color="#39FF14" />
            </div>

            {/* Actions */}
            <div style={{ padding: '8px' }}>
              <MenuRow
                icon={<LogOut size={15} />}
                label="Sign Out"
                color="#FF2D55"
                onClick={async () => { setOpen(false); await logout(); }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatPill({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8px 6px',
        borderRadius: 10,
        background: `${color}10`,
        border: `1px solid ${color}28`,
      }}
    >
      <span style={{ color, display: 'flex', marginBottom: 2 }}>{icon}</span>
      <span style={{ color: 'white', fontWeight: 800, fontSize: '1rem', fontFamily: "'Righteous', sans-serif" }}>{value}</span>
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem' }}>{label}</span>
    </div>
  );
}

function MenuRow({
  icon,
  label,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 12px',
        borderRadius: 10,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color,
        fontWeight: 600,
        fontSize: '0.85rem',
        transition: 'background 0.15s',
        textAlign: 'left',
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = `${color}12`)}
      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
    >
      {icon}
      {label}
    </button>
  );
}
