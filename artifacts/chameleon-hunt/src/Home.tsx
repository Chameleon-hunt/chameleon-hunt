import { motion } from "framer-motion";
import { Map, Trophy, HelpCircle, ShoppingBag, Users, ChevronDown, User, MapPin } from "lucide-react";
import type { Page } from "./App";

// ── 3D Chameleon character SVG ────────────────────────────────────────────────
function BigCharacter() {
  return (
    <svg
      viewBox="0 0 220 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.55))" }}
    >
      <defs>
        <radialGradient id="hG" cx="36%" cy="30%" r="65%">
          <stop offset="0%" stopColor="white" />
          <stop offset="55%" stopColor="#f2f2f2" />
          <stop offset="100%" stopColor="#c4c4c4" />
        </radialGradient>
        <radialGradient id="bG" cx="40%" cy="25%" r="70%">
          <stop offset="0%" stopColor="white" />
          <stop offset="60%" stopColor="#ebebeb" />
          <stop offset="100%" stopColor="#bebebe" />
        </radialGradient>
        <radialGradient id="aG" cx="38%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#f6f6f6" />
          <stop offset="100%" stopColor="#b4b4b4" />
        </radialGradient>
      </defs>

      {/* ── Left arm raised (thumbs up) ── */}
      <ellipse
        cx="34" cy="168" rx="26" ry="66"
        fill="url(#aG)"
        transform="rotate(-48 34 168)"
      />
      {/* Hand ball */}
      <circle cx="12" cy="120" r="24" fill="url(#hG)" />
      {/* Thumb */}
      <ellipse
        cx="2" cy="104" rx="10" ry="18"
        fill="url(#hG)"
        transform="rotate(-28 2 104)"
      />
      {/* Thumb highlight */}
      <ellipse cx="-1" cy="100" rx="4" ry="7" fill="white" opacity="0.5" transform="rotate(-28 -1 100)" />
      {/* Hand highlight */}
      <circle cx="8" cy="116" r="8" fill="white" opacity="0.45" />

      {/* ── Head ── */}
      <circle cx="112" cy="96" r="82" fill="url(#hG)" />
      {/* Head main shine */}
      <ellipse
        cx="84" cy="66" rx="28" ry="17"
        fill="white" opacity="0.55"
        transform="rotate(-28 84 66)"
      />
      {/* Secondary shine */}
      <ellipse cx="140" cy="72" rx="10" ry="7" fill="white" opacity="0.3" />

      {/* ── Eyes ── */}
      <rect x="74" y="82" width="22" height="30" rx="7" fill="#111" />
      <rect x="128" y="82" width="22" height="30" rx="7" fill="#111" />
      {/* Eye glints */}
      <rect x="79" y="87" width="8" height="9" rx="3" fill="#555" />
      <rect x="133" y="87" width="8" height="9" rx="3" fill="#555" />

      {/* ── Smile ── */}
      <path
        d="M 76 124 Q 112 158 148 124"
        stroke="#111" strokeWidth="7" fill="none" strokeLinecap="round"
      />

      {/* ── Body ── */}
      <ellipse cx="112" cy="290" rx="76" ry="96" fill="url(#bG)" />
      {/* Body shine */}
      <ellipse
        cx="88" cy="248" rx="20" ry="32"
        fill="white" opacity="0.38"
        transform="rotate(-12 88 248)"
      />

      {/* ── Right arm (hanging slightly forward) ── */}
      <ellipse
        cx="194" cy="240" rx="24" ry="58"
        fill="url(#aG)"
        transform="rotate(18 194 240)"
      />
      {/* Right hand */}
      <circle cx="200" cy="295" r="22" fill="url(#hG)" />
      <circle cx="194" cy="289" r="8" fill="white" opacity="0.4" />

      {/* ── Legs ── */}
      <ellipse cx="86" cy="376" rx="30" ry="22" fill="url(#aG)" />
      <ellipse cx="138" cy="376" rx="30" ry="22" fill="url(#aG)" />
      <ellipse cx="86" cy="376" rx="14" ry="8" fill="white" opacity="0.3" />
      <ellipse cx="138" cy="376" rx="14" ry="8" fill="white" opacity="0.3" />
    </svg>
  );
}

// ── Logo mark ─────────────────────────────────────────────────────────────────
export function LogoMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? 0.7 : size === "lg" ? 1.3 : 1;
  return (
    <div
      style={{
        background: "linear-gradient(145deg, #0a0a1a 0%, #111128 100%)",
        border: "2.5px solid rgba(255,255,255,0.12)",
        borderRadius: 14 * s,
        padding: `${8 * s}px ${12 * s}px`,
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        lineHeight: 1.05,
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}
    >
      <span
        style={{
          fontFamily: "'Righteous', sans-serif",
          fontSize: 18 * s,
          fontWeight: 900,
          color: "white",
          letterSpacing: "0.08em",
        }}
      >
        CHAMELEON
      </span>
      <span style={{ display: "flex", gap: 1 * s, fontSize: 20 * s, fontFamily: "'Righteous', sans-serif", fontWeight: 900 }}>
        {[
          ["H", "#FF2D55"],
          ["U", "#39FF14"],
          ["N", "#0080FF"],
          ["T", "#FFE600"],
        ].map(([l, c]) => (
          <span key={l} style={{ color: c }}>{l}</span>
        ))}
      </span>
    </div>
  );
}

// ── Feature card data ──────────────────────────────────────────────────────────
const FEATURE_CARDS = [
  {
    id: "map" as Page,
    icon: <Map className="w-8 h-8" />,
    title: "THE MAP",
    sub: ["Explore cities", "Find characters"],
    gradient: "linear-gradient(135deg, #1a6dcc 0%, #0a3d7a 100%)",
    border: "rgba(26,109,204,0.6)",
    bg: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: "characters" as Page,
    icon: <Users className="w-8 h-8" />,
    title: "CHARACTERS",
    sub: ["Discover them all"],
    gradient: "linear-gradient(135deg, #1a7a40 0%, #0a4020 100%)",
    border: "rgba(26,122,64,0.6)",
    bg: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: null,
    icon: <Trophy className="w-8 h-8" />,
    title: "LEADERBOARD",
    sub: ["Top hunters"],
    gradient: "linear-gradient(135deg, #b8860b 0%, #7a5500 100%)",
    border: "rgba(184,134,11,0.6)",
    bg: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: "howtoplay" as Page,
    icon: <HelpCircle className="w-8 h-8" />,
    title: "HOW TO PLAY",
    sub: ["Easy to learn", "Hard to master"],
    gradient: "linear-gradient(135deg, #6a0dad 0%, #3d0080 100%)",
    border: "rgba(106,13,173,0.6)",
    bg: "https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: null,
    icon: <ShoppingBag className="w-8 h-8" />,
    title: "SHOP",
    sub: ["Get cool gear"],
    gradient: "linear-gradient(135deg, #6b3020 0%, #3d1a0a 100%)",
    border: "rgba(107,48,32,0.6)",
    bg: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=60",
  },
];

const NAV_LINKS: Array<{ label: string; page: Page | null }> = [
  { label: "HOME", page: "home" },
  { label: "MAP", page: "map" },
  { label: "CHARACTERS", page: "characters" },
  { label: "LEADERBOARD", page: null },
  { label: "HOW TO PLAY", page: "howtoplay" },
];

// ── Main Home component ────────────────────────────────────────────────────────
export function Home({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div
      className="min-h-[100dvh] flex flex-col"
      style={{ background: "#0a0a18", fontFamily: "'Outfit', sans-serif" }}
    >
      {/* ══ NAVBAR ══════════════════════════════════════════════════════════ */}
      <nav
        className="relative z-30 flex items-center justify-between px-6 py-3"
        style={{
          background: "rgba(8,8,20,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <button onClick={() => onNavigate("home")} className="flex-shrink-0">
          <LogoMark size="sm" />
        </button>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, page }) => (
            <button
              key={label}
              onClick={() => page && onNavigate(page)}
              className="text-sm font-bold tracking-widest transition-colors"
              style={{
                fontFamily: "'Righteous', sans-serif",
                color: page ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.82)",
                cursor: page ? "pointer" : "default",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold text-white"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            EN <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
          >
            <User className="w-5 h-5 text-white" />
          </button>
        </div>
      </nav>

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section
        className="relative flex-grow flex flex-col"
        style={{ minHeight: "calc(100dvh - 60px)" }}
      >
        {/* Background photo + gradient overlays */}
        <div className="absolute inset-0 z-0">
          {/* City background image */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=80')`,
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
            }}
          />
          {/* Dark left gradient for text contrast */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(100deg, rgba(4,4,16,0.95) 0%, rgba(4,4,16,0.82) 30%, rgba(4,4,16,0.25) 58%, transparent 75%)",
            }}
          />
          {/* Bottom fade for cards */}
          <div
            className="absolute bottom-0 left-0 right-0 h-56"
            style={{ background: "linear-gradient(to top, rgba(4,4,16,0.98) 0%, transparent 100%)" }}
          />
          {/* Subtle top darken */}
          <div
            className="absolute top-0 left-0 right-0 h-32"
            style={{ background: "linear-gradient(to bottom, rgba(4,4,16,0.7) 0%, transparent 100%)" }}
          />
        </div>

        {/* Hero content grid */}
        <div className="relative z-10 flex-grow flex items-stretch px-6 md:px-12 lg:px-16 pt-10 pb-4">
          <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1.1fr] gap-8 items-center">

            {/* ── Left: Text content ── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col gap-5"
            >
              {/* Title */}
              <div>
                <h1
                  className="text-white uppercase leading-none"
                  style={{ fontFamily: "'Righteous', sans-serif", fontSize: "clamp(3.2rem, 8vw, 6.5rem)", fontWeight: 900 }}
                >
                  CHAMELEON
                </h1>
                <div
                  className="flex gap-3 leading-none"
                  style={{ fontSize: "clamp(3.8rem, 9.5vw, 8rem)", fontFamily: "'Righteous', sans-serif", fontWeight: 900 }}
                >
                  {[
                    ["H", "#FF2D55"],
                    ["U", "#39FF14"],
                    ["N", "#0080FF"],
                    ["T", "#FFE600"],
                  ].map(([letter, color]) => (
                    <motion.span
                      key={letter}
                      style={{ color, display: "inline-block", textShadow: `0 0 40px ${color}88` }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + (letter === "H" ? 0 : letter === "U" ? 0.06 : letter === "N" ? 0.12 : 0.18), duration: 0.5 }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-white font-bold text-xl md:text-2xl leading-snug"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
              >
                A real city. Hidden characters.<br />Your mission.
              </motion.p>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65, duration: 0.4 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onNavigate("map")}
                className="self-start flex items-center gap-3 font-bold uppercase tracking-wider text-white rounded-full"
                style={{
                  fontFamily: "'Righteous', sans-serif",
                  fontSize: "1.15rem",
                  letterSpacing: "0.1em",
                  background: "linear-gradient(135deg, #ff2d55 0%, #e0001a 100%)",
                  padding: "15px 38px",
                  boxShadow: "0 8px 32px rgba(255,45,85,0.55), 0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                START HUNT <span style={{ fontSize: "1.3em", lineHeight: 1 }}>→</span>
              </motion.button>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex flex-wrap gap-4 mt-2"
              >
                {[
                  { icon: <Trophy className="w-5 h-5 text-yellow-400" />, stat: "9", label: "Characters Hidden" },
                  { icon: <MapPin className="w-5 h-5 text-red-400" />, stat: "1", label: "City Active" },
                ].map(({ icon, stat, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    {icon}
                    <div>
                      <span className="text-white font-bold text-base">{stat}+ </span>
                      <span className="text-white/60 text-sm">{label}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Right: Character + badge ── */}
            <motion.div
              initial={{ opacity: 0, x: 60, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.85, ease: "easeOut" }}
              className="relative flex items-end justify-center"
              style={{ minHeight: "clamp(320px, 55vh, 620px)" }}
            >
              {/* The character */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: "5%",
                  width: "clamp(260px, 42vw, 520px)",
                  height: "clamp(360px, 60vh, 700px)",
                }}
              >
                <BigCharacter />
              </div>

              {/* "NEW CITY ADDED!" badge */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 200, damping: 12 }}
                className="absolute flex flex-col items-center justify-center text-center rounded-full z-20"
                style={{
                  bottom: "32%",
                  right: "clamp(200px, 40vw, 460px)",
                  width: 110,
                  height: 110,
                  background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
                  border: "3px solid rgba(255,255,255,0.25)",
                  boxShadow: "0 8px 32px rgba(124,58,237,0.6)",
                }}
              >
                <span className="text-yellow-300 font-black text-sm leading-none tracking-widest" style={{ fontFamily: "'Righteous', sans-serif" }}>NEW</span>
                <span className="text-white font-black text-xs leading-tight mt-1 tracking-wide">CITY<br/>ADDED!</span>
              </motion.div>

              {/* Top-right card: "FIND THEM..." */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="absolute top-4 right-4 md:top-8 md:right-2 rounded-2xl p-4 text-right hidden md:block"
                style={{
                  background: "rgba(8,8,24,0.88)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                  maxWidth: 200,
                }}
              >
                <p className="text-white font-black text-lg leading-snug" style={{ fontFamily: "'Righteous', sans-serif" }}>
                  FIND THEM.<br />
                  AIM HIGHER.<br />
                  BE THE BEST.
                </p>
                <div className="flex justify-end mt-2">
                  <span className="text-2xl">⭐</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ══ FEATURE CARDS ROW ══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative z-10 px-4 pb-6 pt-0"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-6xl mx-auto">
            {FEATURE_CARDS.map((card, i) => (
              <motion.button
                key={card.title}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => card.id && onNavigate(card.id)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.07, duration: 0.45 }}
                className="relative overflow-hidden rounded-2xl p-4 flex flex-col gap-2 text-left"
                style={{
                  background: card.gradient,
                  border: `1.5px solid ${card.border}`,
                  minHeight: 130,
                  cursor: card.id ? "pointer" : "default",
                }}
              >
                {/* Background image overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('${card.bg}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.18,
                  }}
                />
                <div className="relative z-10 text-white opacity-90">{card.icon}</div>
                <div className="relative z-10">
                  <p className="text-white font-black text-sm tracking-wider leading-tight" style={{ fontFamily: "'Righteous', sans-serif" }}>
                    {card.title}
                  </p>
                  {card.sub.map((s) => (
                    <p key={s} className="text-white/65 text-xs leading-snug">{s}</p>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ FOOTER TAGLINE ═══════════════════════════════════════════════════ */}
      <div
        className="relative z-10 text-center py-3 text-white/50 text-sm font-medium flex items-center justify-center gap-2"
        style={{ background: "rgba(4,4,14,0.95)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        Found it? <span className="text-lg">😊</span> Keep it!
      </div>
    </div>
  );
}
