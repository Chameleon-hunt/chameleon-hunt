import { motion } from 'framer-motion';
import { MapPin, Trophy, Zap } from 'lucide-react';
import { LogoMark, BigCharacter } from '../Home';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  return (
    <div
      className="min-h-[100dvh] flex flex-col relative overflow-hidden"
      style={{ background: '#08081a', fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Background city image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(120deg, rgba(4,4,16,0.97) 0%, rgba(4,4,16,0.88) 45%, rgba(4,4,16,0.4) 70%, transparent 85%)',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,8,26,1) 0%, transparent 55%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(4,4,14,0.65) 0%, transparent 18%)' }} />
      </div>

      {/* Colour blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: -60, left: -80, width: 400, height: 320, background: '#FF2D55', borderRadius: '50%', filter: 'blur(110px)', opacity: 0.07 }} />
        <div style={{ position: 'absolute', bottom: '10%', right: -40, width: 360, height: 300, background: '#0080FF', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.07 }} />
        <div style={{ position: 'absolute', top: '35%', left: '55%', width: 300, height: 260, background: '#39FF14', borderRadius: '50%', filter: 'blur(110px)', opacity: 0.05 }} />
      </div>

      {/* Top navbar */}
      <nav
        className="relative z-30 flex items-center justify-between px-5 md:px-10 py-4 flex-shrink-0"
        style={{ background: 'rgba(6,6,18,0.5)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <LogoMark size="sm" />
        <button
          onClick={onSignIn}
          style={{
            fontFamily: "'Righteous', sans-serif",
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.7)',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 10,
            padding: '8px 18px',
            cursor: 'pointer',
            transition: 'all 0.18s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
        >
          SIGN IN
        </button>
      </nav>

      {/* Main content */}
      <div
        className="relative z-10 flex-1 flex items-center px-5 md:px-10 lg:px-16 py-8"
        style={{ minHeight: 'calc(100dvh - 60px)' }}
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* LEFT: copy + CTA */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="flex flex-col gap-6"
          >
            {/* Live city badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                borderRadius: 999,
                background: 'rgba(255,45,85,0.1)',
                border: '1px solid rgba(255,45,85,0.35)',
                width: 'fit-content',
              }}
            >
              <MapPin size={13} color="#FF2D55" />
              <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: '0.72rem', color: '#FF2D55', letterSpacing: '0.14em', fontWeight: 700 }}>
                HAIFA, ISRAEL
              </span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#39FF14', display: 'inline-block', animation: 'markerPulse 1.8s infinite' }} />
              <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: '0.72rem', color: '#39FF14', letterSpacing: '0.12em' }}>LIVE</span>
            </motion.div>

            {/* Main headline */}
            <div>
              <h1
                className="text-white uppercase leading-none"
                style={{ fontFamily: "'Righteous', sans-serif", fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 0.95 }}
              >
                CHAMELEON
              </h1>
              <div style={{ display: 'flex', gap: 'clamp(5px, 1.5vw, 16px)', fontSize: 'clamp(3.6rem, 10vw, 7.5rem)', fontFamily: "'Righteous', sans-serif", fontWeight: 900, lineHeight: 1 }}>
                {(['H', 'U', 'N', 'T'] as const).map((letter, i) => {
                  const color = ['#FF2D55', '#39FF14', '#0080FF', '#FFE600'][i];
                  return (
                    <motion.span
                      key={letter}
                      style={{ color, display: 'inline-block', textShadow: `0 0 40px ${color}88` }}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.07, duration: 0.45 }}
                    >
                      {letter}
                    </motion.span>
                  );
                })}
              </div>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                lineHeight: 1.55,
                maxWidth: 440,
              }}
            >
              Hunt hand-painted 3D-printed figures hidden across the city.
              Find them all. Earn XP. Become an Elite Hunter.
            </motion.p>

            {/* Stats pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              {[
                { icon: <MapPin size={14} color="#FF2D55" />, val: '11', label: 'Hidden Figures' },
                { icon: <Trophy size={14} color="#FFE600" />, val: '1', label: 'City Active' },
                { icon: <Zap size={14} color="#39FF14" />, val: '∞', label: 'XP to Earn' },
              ].map(({ icon, val, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {icon}
                  <span className="text-white font-bold text-sm">{val}</span>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem' }}>{label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
              style={{ maxWidth: 400 }}
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGetStarted}
                style={{
                  flex: 1,
                  padding: '16px 32px',
                  borderRadius: 999,
                  fontFamily: "'Righteous', sans-serif",
                  fontSize: '1.08rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: 'white',
                  background: 'linear-gradient(135deg, #ff2d55 0%, #d4001a 100%)',
                  border: 'none',
                  boxShadow: '0 8px 32px rgba(255,45,85,0.55), 0 2px 8px rgba(0,0,0,0.4)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                GET STARTED →
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSignIn}
                style={{
                  flex: 1,
                  padding: '16px 32px',
                  borderRadius: 999,
                  fontFamily: "'Righteous', sans-serif",
                  fontSize: '1.08rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.8)',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                SIGN IN
              </motion.button>
            </motion.div>
          </motion.div>

          {/* RIGHT: Mascot */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="relative flex items-end justify-center"
            style={{ minHeight: 'clamp(280px, 50vh, 580px)' }}
          >
            <div style={{ position: 'absolute', bottom: 0, right: 'clamp(-10px, 2vw, 20px)', width: 'clamp(220px, 38vw, 460px)', height: 'clamp(310px, 55vh, 640px)' }}>
              <BigCharacter />
            </div>

            {/* Floating "11 FIGURES" badge */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 200, damping: 12 }}
              style={{
                position: 'absolute',
                bottom: '42%',
                right: 'clamp(190px, 37vw, 430px)',
                width: 90,
                height: 90,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF6B00 0%, #d45500 100%)',
                border: '3px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(255,107,0,0.55)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
              }}
            >
              <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: '1.6rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>11</span>
              <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: '0.58rem', color: 'rgba(255,255,255,0.85)', letterSpacing: '0.1em' }}>FIGURES</span>
            </motion.div>

            {/* Floating "FREE TO PLAY" badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.5 }}
              style={{
                position: 'absolute',
                top: '12%',
                right: 'clamp(210px, 40vw, 460px)',
                padding: '8px 16px',
                borderRadius: 999,
                background: 'rgba(57,255,20,0.12)',
                border: '1px solid rgba(57,255,20,0.4)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: '0.72rem', color: '#39FF14', letterSpacing: '0.1em', fontWeight: 700 }}>
                🎮 FREE TO PLAY
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to top, #08081a, transparent)', zIndex: 5, pointerEvents: 'none' }} />
    </div>
  );
}
