/**
 * Custom game-style "Continue with Google" button.
 * Matches the olive-green framed style in the reference image.
 */
export function GoogleButton({ onClick, loading }: { onClick: () => void; loading?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        width: '100%',
        padding: '13px 20px',
        borderRadius: '10px',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily: "'Righteous', sans-serif",
        fontSize: '1rem',
        fontWeight: 700,
        color: '#1a2800',
        letterSpacing: '0.03em',
        opacity: loading ? 0.7 : 1,
        transition: 'transform 0.12s, opacity 0.12s',
        // Olive-green game-style layered border
        background: 'linear-gradient(180deg, #c5dd60 0%, #91b030 30%, #6e8c1c 70%, #587015 100%)',
        border: '3px solid #2e4408',
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.38),
          inset 0 -3px 6px rgba(0,0,0,0.28),
          0 0 0 1px #7aaa20,
          0 6px 20px rgba(0,0,0,0.55)
        `,
        outline: 'none',
      }}
      onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.025)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
      onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
      onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.025)'; }}
    >
      {/* Corner ornaments */}
      <CornerOrnament pos="tl" />
      <CornerOrnament pos="tr" />
      <CornerOrnament pos="bl" />
      <CornerOrnament pos="br" />

      {/* Google G logo */}
      <GoogleG />

      <span style={{ position: 'relative', zIndex: 1 }}>
        {loading ? 'Signing in…' : 'Continue with Google'}
      </span>
    </button>
  );
}

function GoogleG() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 48 48"
      style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}
    >
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19.1 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.4l-6.5-5.5C29.5 35 26.9 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.1C9.4 35.7 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l.1-.1 6.5 5.5C37.1 39.3 44 33 44 24c0-1.3-.1-2.7-.4-3.9z"/>
    </svg>
  );
}

type Pos = 'tl' | 'tr' | 'bl' | 'br';
function CornerOrnament({ pos }: { pos: Pos }) {
  const style: React.CSSProperties = {
    position: 'absolute',
    width: 18,
    height: 18,
    zIndex: 1,
    ...(pos === 'tl' ? { top: 3, left: 3 } : {}),
    ...(pos === 'tr' ? { top: 3, right: 3, transform: 'scaleX(-1)' } : {}),
    ...(pos === 'bl' ? { bottom: 3, left: 3, transform: 'scaleY(-1)' } : {}),
    ...(pos === 'br' ? { bottom: 3, right: 3, transform: 'scale(-1,-1)' } : {}),
  };
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M2 2 Q2 8 8 8 Q8 2 14 2" stroke="#2e4408" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <circle cx="2" cy="2" r="2" fill="#2e4408"/>
    </svg>
  );
}
