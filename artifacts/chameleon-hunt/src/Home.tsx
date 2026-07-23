import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Trophy, HelpCircle, ShoppingBag, Users, ChevronDown, MapPin, Check, Star, Zap, Shield } from "lucide-react";
import type { Page } from "./App";
import { useLang, LANG_LABELS, type Lang } from "./lib/i18n";
import { useAuth } from "./lib/auth";
import { UserMenu } from "./components/UserMenu";
import { FIGURES } from "./lib/figures";

// ─────────────────────────────────────────────────────────────────────────────
// XP / Rank system
// ─────────────────────────────────────────────────────────────────────────────
const RANKS = [
  { title: "Rookie Hunter",  minXP: 0,    color: "#888888",  icon: "🔍" },
  { title: "Scout",          minXP: 100,  color: "#39FF14",  icon: "🌿" },
  { title: "Field Agent",    minXP: 300,  color: "#0080FF",  icon: "🔵" },
  { title: "Hunter",         minXP: 600,  color: "#FF6B00",  icon: "🎯" },
  { title: "Master Hunter",  minXP: 900,  color: "#FFE600",  icon: "⭐" },
  { title: "Elite Hunter",   minXP: 1100, color: "#FF2D55",  icon: "🔥" },
];

function getRank(xp: number) {
  let rank = RANKS[0];
  for (const r of RANKS) { if (xp >= r.minXP) rank = r; }
  const idx = RANKS.indexOf(rank);
  const next = RANKS[idx + 1];
  const progress = next
    ? Math.min(1, (xp - rank.minXP) / (next.minXP - rank.minXP))
    : 1;
  return { ...rank, next, progress, idx };
}

// ─────────────────────────────────────────────────────────────────────────────
// BigCharacter SVG  (3-D white mascot)
// ─────────────────────────────────────────────────────────────────────────────
export function BigCharacter() {
  return (
    <svg
      viewBox="0 0 240 430" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", filter: "drop-shadow(0 30px 80px rgba(0,0,0,0.6))" }}
    >
      <defs>
        <radialGradient id="hG2" cx="35%" cy="28%" r="65%">
          <stop offset="0%"   stopColor="white" />
          <stop offset="50%"  stopColor="#f4f4f4" />
          <stop offset="100%" stopColor="#c8c8c8" />
        </radialGradient>
        <radialGradient id="bG2" cx="38%" cy="26%" r="68%">
          <stop offset="0%"   stopColor="white" />
          <stop offset="55%"  stopColor="#efefef" />
          <stop offset="100%" stopColor="#c0c0c0" />
        </radialGradient>
        <radialGradient id="aG2" cx="40%" cy="32%" r="62%">
          <stop offset="0%"   stopColor="#f8f8f8" />
          <stop offset="100%" stopColor="#b8b8b8" />
        </radialGradient>
        <radialGradient id="sG2" cx="30%" cy="28%" r="60%">
          <stop offset="0%"   stopColor="white" />
          <stop offset="100%" stopColor="#cccccc" />
        </radialGradient>
      </defs>
      <ellipse cx="36" cy="176" rx="22" ry="62" fill="url(#aG2)" transform="rotate(-52 36 176)" />
      <ellipse cx="16" cy="120" rx="18" ry="28" fill="url(#aG2)" transform="rotate(-35 16 120)" />
      <circle cx="8" cy="102" r="22" fill="url(#hG2)" />
      <ellipse cx="-4" cy="88" rx="9" ry="16" fill="url(#hG2)" transform="rotate(-30 -4 88)" />
      <ellipse cx="3" cy="97" rx="8" ry="6" fill="white" opacity="0.5" transform="rotate(-20 3 97)" />
      <circle cx="128" cy="110" r="98" fill="url(#hG2)" />
      <ellipse cx="95" cy="74" rx="30" ry="19" fill="white" opacity="0.58" transform="rotate(-28 95 74)" />
      <ellipse cx="162" cy="80" rx="12" ry="8" fill="white" opacity="0.28" />
      <rect x="89" y="90" width="26" height="30" rx="7" fill="#111" />
      <rect x="143" y="90" width="26" height="30" rx="7" fill="#111" />
      <rect x="94" y="95" width="9" height="10" rx="3" fill="#444" />
      <rect x="148" y="95" width="9" height="10" rx="3" fill="#444" />
      <path d="M 88 132 Q 128 168 168 132" stroke="#111" strokeWidth="7" fill="none" strokeLinecap="round" />
      <ellipse cx="128" cy="305" rx="72" ry="90" fill="url(#bG2)" />
      <ellipse cx="104" cy="262" rx="20" ry="32" fill="white" opacity="0.35" transform="rotate(-14 104 262)" />
      <ellipse cx="208" cy="262" rx="22" ry="54" fill="url(#aG2)" transform="rotate(22 208 262)" />
      <circle cx="218" cy="312" r="20" fill="url(#sG2)" />
      <ellipse cx="212" cy="306" rx="8" ry="6" fill="white" opacity="0.42" />
      <ellipse cx="102" cy="386" rx="30" ry="38" fill="url(#aG2)" />
      <ellipse cx="95" cy="380" rx="12" ry="8" fill="white" opacity="0.32" />
      <ellipse cx="100" cy="416" rx="26" ry="16" fill="url(#aG2)" />
      <ellipse cx="154" cy="386" rx="30" ry="38" fill="url(#aG2)" />
      <ellipse cx="147" cy="380" rx="12" ry="8" fill="white" opacity="0.32" />
      <ellipse cx="152" cy="416" rx="26" ry="16" fill="url(#aG2)" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LogoMark
// ─────────────────────────────────────────────────────────────────────────────
export function LogoMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? 0.72 : size === "lg" ? 1.3 : 1;
  return (
    <div style={{
      background: "linear-gradient(145deg, #0a0a1a 0%, #111128 100%)",
      border: "2px solid rgba(255,255,255,0.10)",
      borderRadius: 14 * s,
      padding: `${8 * s}px ${12 * s}px`,
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      lineHeight: 1.05,
      boxShadow: "0 4px 20px rgba(0,0,0,0.55)",
    }}>
      <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: 17 * s, fontWeight: 900, color: "white", letterSpacing: "0.06em" }}>CHAMELEON</span>
      <span style={{ display: "flex", gap: 1, fontSize: 19 * s, fontFamily: "'Righteous', sans-serif", fontWeight: 900 }}>
        {(["H","U","N","T"] as const).map((l, i) => (
          <span key={l} style={{ color: ["#FF2D55","#39FF14","#0080FF","#FFE600"][i] }}>{l}</span>
        ))}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Coming Soon Modal
// ─────────────────────────────────────────────────────────────────────────────
function ComingSoonModal({ label, onClose }: { label: string; onClose: () => void }) {
  const { t } = useLang();
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="rounded-3xl p-8 text-center max-w-sm w-full"
        style={{ background: "linear-gradient(145deg, #0c0c22, #131330)", border: "2px solid rgba(255,255,255,0.12)", boxShadow: "0 30px 80px rgba(0,0,0,0.7)" }}
      >
        <div className="text-5xl mb-4">🚀</div>
        <h2 className="text-white text-3xl font-black mb-2" style={{ fontFamily: "'Righteous', sans-serif" }}>{label}</h2>
        <p className="text-3xl font-black mb-1" style={{ fontFamily: "'Righteous', sans-serif", color: "#FF6B00" }}>{t.comingSoon}</p>
        <p className="mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>{t.comingSoonSub}</p>
        <button onClick={onClose} className="w-full py-3 rounded-2xl font-bold text-white" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>{t.back}</button>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Language Picker
// ─────────────────────────────────────────────────────────────────────────────
function LangPicker() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const langs: Lang[] = ["en", "ar", "ru", "he"];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold text-white transition-colors"
        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        {LANG_LABELS[lang]}
        <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 rounded-2xl overflow-hidden z-50"
            style={{ background: "rgba(12,12,28,0.98)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 16px 40px rgba(0,0,0,0.6)", minWidth: 130, right: 0 }}
          >
            {langs.map(l => (
              <button key={l} onClick={() => { setLang(l); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm font-bold transition-colors hover:bg-white/5 flex items-center justify-between"
                style={{ color: lang === l ? "#FF6B00" : "rgba(255,255,255,0.75)" }}
              >
                {LANG_LABELS[l]}
                {lang === l && <span style={{ color: "#FF6B00", fontSize: 10 }}>✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Figure status dot grid
// ─────────────────────────────────────────────────────────────────────────────
function FigureGrid({ foundIds, onFigureClick }: { foundIds: number[]; onFigureClick: (id: number) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {FIGURES.map((fig, i) => {
        const found = foundIds.includes(fig.id);
        const colors = ["#FF2D55","#FF6B00","#FFE600","#39FF14","#0080FF","#9B59B6","#FF2D55","#FF6B00","#FFE600","#39FF14","#0080FF"];
        const c = colors[i % colors.length];
        return (
          <motion.button
            key={fig.id}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onFigureClick(fig.id)}
            title={fig.name}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: found ? "rgba(57,255,20,0.18)" : "rgba(255,255,255,0.05)",
              border: `2px solid ${found ? "#39FF14" : c + "66"}`,
              boxShadow: found ? "0 0 12px rgba(57,255,20,0.4)" : "none",
              position: "relative",
              cursor: "pointer",
              transition: "all 0.18s",
            }}
          >
            {found ? (
              <Check size={14} color="#39FF14" strokeWidth={2.5} />
            ) : (
              <span style={{ fontSize: "0.65rem", fontWeight: 800, color: c, fontFamily: "'Righteous', sans-serif" }}>
                {fig.id}
              </span>
            )}
            {!found && (
              <span style={{
                position: "absolute", top: 1, right: 1, width: 7, height: 7,
                background: "#FF6B00", borderRadius: "50%", border: "1.5px solid #08081a",
              }} />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Radar "live" pulse badge
// ─────────────────────────────────────────────────────────────────────────────
function LiveBadge() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 12px", borderRadius: 999, background: "rgba(57,255,20,0.1)", border: "1px solid rgba(57,255,20,0.35)" }}>
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        style={{ width: 7, height: 7, borderRadius: "50%", background: "#39FF14" }}
      />
      <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#39FF14", letterSpacing: "0.12em" }}>LIVE</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Segmented progress bar
// ─────────────────────────────────────────────────────────────────────────────
function SegmentBar({ found, total }: { found: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          style={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            background: i < found
              ? "linear-gradient(90deg, #39FF14, #00cc00)"
              : "rgba(255,255,255,0.08)",
            boxShadow: i < found ? "0 0 6px rgba(57,255,20,0.5)" : "none",
            transformOrigin: "left",
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Home / City Lobby component
// ─────────────────────────────────────────────────────────────────────────────
export function Home({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { t } = useLang();
  const { profile } = useAuth();
  const [comingSoonLabel, setComingSoonLabel] = useState<string | null>(null);

  // Merge Firestore + localStorage found IDs
  const foundIds: number[] = (() => {
    const local: number[] = (() => {
      try { return JSON.parse(localStorage.getItem("chameleon_hunt_found") ?? "[]"); }
      catch { return []; }
    })();
    return [...new Set([...local, ...(profile?.foundIds ?? [])])];
  })();

  const xp = profile?.xp ?? foundIds.length * 100;
  const rank = getRank(xp);
  const foundCount = foundIds.length;
  const total = FIGURES.length;
  const pct = Math.round((foundCount / total) * 100);

  const username = profile?.username ?? "Hunter";
  const photoURL = profile?.photoURL;

  const NAV_LINKS = [
    { key: "home" as const, page: "home" as Page, comingSoon: false },
    { key: "map" as const, page: "map" as Page, comingSoon: false },
    { key: "characters" as const, page: "characters" as Page, comingSoon: false },
    { key: "leaderboard" as const, page: null as Page | null, comingSoon: true },
    { key: "howToPlay" as const, page: "howtoplay" as Page, comingSoon: false },
  ];

  const FEATURE_CARDS = [
    { page: "map" as Page, label: t.theMap, sub: [t.exploreCities, t.findCharacters], icon: <Map className="w-7 h-7" />, comingSoon: false, color: "#1a6dcc" },
    { page: "characters" as Page, label: t.characters, sub: [t.discoverAll], icon: <Users className="w-7 h-7" />, comingSoon: false, color: "#1a7a40" },
    { page: null as Page | null, label: t.leaderboard, sub: [t.topHunters], icon: <Trophy className="w-7 h-7" />, comingSoon: true, color: "#b8860b" },
    { page: "howtoplay" as Page, label: t.howToPlay, sub: [t.easyToLearn, t.hardToMaster], icon: <HelpCircle className="w-7 h-7" />, comingSoon: false, color: "#6a0dad" },
    { page: null as Page | null, label: "SHOP", sub: [t.getCoolGear], icon: <ShoppingBag className="w-7 h-7" />, comingSoon: true, color: "#6b3020" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "#08081a", fontFamily: "'Outfit', sans-serif" }}>

      {/* ══════════════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════════════ */}
      <nav
        className="relative z-30 flex items-center justify-between px-4 md:px-6 py-2.5 flex-shrink-0"
        style={{ background: "rgba(6,6,18,0.96)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button onClick={() => onNavigate("home")} className="flex-shrink-0">
          <LogoMark size="sm" />
        </button>

        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ key, page, comingSoon }) => (
            <button key={key}
              onClick={() => comingSoon ? setComingSoonLabel(t[key] as string) : page && onNavigate(page)}
              className="text-xs font-bold tracking-widest transition-colors hover:text-white"
              style={{ fontFamily: "'Righteous', sans-serif", color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em" }}
            >
              {t[key] as string}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <LangPicker />
          <UserMenu />
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════
          HERO  — Mission Briefing
      ══════════════════════════════════════════════════════════ */}
      <section className="relative flex-shrink-0" style={{ minHeight: "calc(100dvh - 56px)" }}>

        {/* Background city photo */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=80')`,
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
            }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(4,4,16,0.97) 0%, rgba(4,4,16,0.88) 40%, rgba(4,4,16,0.35) 65%, transparent 80%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,8,26,1) 0%, transparent 55%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(4,4,14,0.5) 0%, transparent 20%)" }} />
        </div>

        {/* Colour blobs */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
          <div style={{ position: "absolute", top: -40, left: -60, width: 380, height: 300, background: "#FF2D55", borderRadius: "50%", filter: "blur(100px)", opacity: 0.07 }} />
          <div style={{ position: "absolute", bottom: "20%", right: -40, width: 320, height: 280, background: "#0080FF", borderRadius: "50%", filter: "blur(90px)", opacity: 0.07 }} />
        </div>

        {/* ── Hero content grid ── */}
        <div className="relative z-10 flex-grow flex items-center px-5 md:px-10 lg:px-16 pt-6 pb-4" style={{ minHeight: "calc(100dvh - 56px)", display: "flex", alignItems: "center" }}>
          <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-center">

            {/* ── LEFT: Mission briefing ── */}
            <motion.div
              initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col gap-5"
            >
              {/* Operation tag */}
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "5px 14px", borderRadius: 999,
                  background: "rgba(255,107,0,0.12)",
                  border: "1px solid rgba(255,107,0,0.35)",
                }}>
                  <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: "0.7rem", color: "#FF6B00", letterSpacing: "0.14em" }}>⚡ OPERATION</span>
                </div>
                <LiveBadge />
              </motion.div>

              {/* Title */}
              <div>
                <h1 className="text-white uppercase leading-none" style={{ fontFamily: "'Righteous', sans-serif", fontSize: "clamp(2.8rem, 7vw, 5.5rem)", fontWeight: 900 }}>
                  CHAMELEON
                </h1>
                <div style={{ display: "flex", gap: "clamp(5px, 1.2vw, 14px)", lineHeight: 1, fontSize: "clamp(3.2rem, 8.5vw, 7rem)", fontFamily: "'Righteous', sans-serif", fontWeight: 900 }}>
                  {(["H","U","N","T"] as const).map((letter, i) => {
                    const color = ["#FF2D55","#39FF14","#0080FF","#FFE600"][i];
                    return (
                      <motion.span key={letter} style={{ color, display: "inline-block", textShadow: `0 0 40px ${color}77` }}
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.06, duration: 0.45 }}
                      >{letter}</motion.span>
                    );
                  })}
                </div>
              </div>

              {/* Player greeting */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                className="flex items-center gap-3"
              >
                {photoURL ? (
                  <img src={photoURL} alt="" style={{ width: 42, height: 42, borderRadius: "50%", border: "2px solid rgba(255,107,0,0.5)", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#5b21b6)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(124,58,237,0.5)", flexShrink: 0 }}>
                    <span style={{ color: "white", fontWeight: 800, fontSize: "0.85rem", fontFamily: "'Righteous', sans-serif" }}>
                      {username.slice(0,2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", fontWeight: 600 }}>Welcome back,</p>
                  <p style={{ color: "white", fontWeight: 800, fontSize: "1.05rem", fontFamily: "'Righteous', sans-serif" }}>
                    @{username}
                  </p>
                </div>
              </motion.div>

              {/* City + rank pills */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
                className="flex flex-wrap gap-2"
              >
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <MapPin size={13} color="#FF2D55" />
                  <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "white", letterSpacing: "0.08em" }}>HAIFA, ISRAEL</span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999, background: `${rank.color}14`, border: `1px solid ${rank.color}40` }}>
                  <span style={{ fontSize: "0.82rem" }}>{rank.icon}</span>
                  <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: rank.color, letterSpacing: "0.06em" }}>{rank.title}</span>
                </div>
              </motion.div>

              {/* Stats row */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.52 }}
                className="flex flex-wrap gap-3"
              >
                {[
                  { icon: <Trophy size={14} color="#FFE600" />, val: `${foundCount}/${total}`, lbl: "Found" },
                  { icon: <Zap size={14} color="#39FF14" />, val: `${xp}`, lbl: "XP" },
                  { icon: <MapPin size={14} color="#FF2D55" />, val: "1", lbl: t.cityActive },
                ].map(({ icon, val, lbl }) => (
                  <div key={lbl} className="flex items-center gap-2 px-3 py-2 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {icon}
                    <span className="text-white font-bold text-sm">{val}</span>
                    <span className="text-white/50 text-xs">{lbl}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate("map")}
                className="self-start flex items-center gap-3 font-bold uppercase text-white rounded-full"
                style={{
                  fontFamily: "'Righteous', sans-serif",
                  fontSize: "1.05rem",
                  letterSpacing: "0.1em",
                  background: "linear-gradient(135deg, #ff2d55 0%, #d4001a 100%)",
                  padding: "15px 38px",
                  boxShadow: "0 8px 32px rgba(255,45,85,0.55), 0 2px 8px rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,100,100,0.3)",
                }}
              >
                {t.startHunt} <span style={{ fontSize: "1.3em" }}>→</span>
              </motion.button>
            </motion.div>

            {/* ── RIGHT: Character + badges ── */}
            <motion.div
              initial={{ opacity: 0, x: 50, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative flex items-end justify-center"
              style={{ minHeight: "clamp(280px, 52vh, 580px)" }}
            >
              <div style={{ position: "absolute", bottom: 0, right: "clamp(-20px, 2vw, 30px)", width: "clamp(220px, 38vw, 480px)", height: "clamp(310px, 55vh, 650px)" }}>
                <BigCharacter />
              </div>

              {/* NEW CITY badge */}
              <motion.div
                initial={{ scale: 0, rotate: -24 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.85, type: "spring", stiffness: 200, damping: 12 }}
                className="absolute flex flex-col items-center justify-center text-center rounded-full z-20"
                style={{
                  bottom: "34%", right: "clamp(190px, 36vw, 420px)",
                  width: 100, height: 100,
                  background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
                  border: "3px solid rgba(255,255,255,0.22)",
                  boxShadow: "0 8px 32px rgba(124,58,237,0.55)",
                }}
              >
                <span className="text-yellow-300 font-black text-xs leading-none tracking-widest" style={{ fontFamily: "'Righteous', sans-serif" }}>NEW</span>
                <span className="text-white font-black leading-tight mt-1 whitespace-pre-line tracking-wide" style={{ fontSize: 9 }}>{t.newCityAdded}</span>
              </motion.div>

              {/* Progress floating card */}
              <motion.div
                initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95, duration: 0.5 }}
                className="absolute top-4 right-2 rounded-2xl p-4 hidden md:block"
                style={{ background: "rgba(8,8,24,0.92)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(12px)", minWidth: 170 }}
              >
                <p className="text-white/50 text-xs mb-2 font-semibold tracking-wider">MISSION PROGRESS</p>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-white font-black text-2xl" style={{ fontFamily: "'Righteous', sans-serif" }}>{pct}%</span>
                  <span className="text-white/40 text-xs">{foundCount}/{total}</span>
                </div>
                <SegmentBar found={foundCount} total={total} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MISSION STATUS PANEL
      ══════════════════════════════════════════════════════════ */}
      <section style={{ background: "rgba(6,6,18,0.99)", borderTop: "1px solid rgba(255,107,0,0.12)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">

          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <div style={{ width: 4, height: 22, borderRadius: 2, background: "linear-gradient(180deg,#FF6B00,#FF2D55)" }} />
            <h2 style={{ fontFamily: "'Righteous', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.7)", letterSpacing: "0.14em" }}>
              MISSION STATUS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* ── Card 1: Figure Progress ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              className="rounded-3xl p-6"
              style={{ background: "rgba(12,12,26,0.9)", border: "1.5px solid rgba(255,255,255,0.07)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em" }}>OPERATION HAIFA</p>
                  <h3 style={{ fontFamily: "'Righteous', sans-serif", fontSize: "1.25rem", color: "white", marginTop: 2 }}>Figure Status</h3>
                </div>
                <div style={{
                  padding: "6px 14px", borderRadius: 999,
                  background: foundCount === total ? "rgba(57,255,20,0.15)" : "rgba(255,107,0,0.1)",
                  border: `1px solid ${foundCount === total ? "rgba(57,255,20,0.4)" : "rgba(255,107,0,0.3)"}`,
                }}>
                  <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: "0.8rem", fontWeight: 700, color: foundCount === total ? "#39FF14" : "#FF6B00" }}>
                    {foundCount}/{total} FOUND
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex justify-between text-xs mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                  <span>City completion</span>
                  <span style={{ color: "#39FF14", fontWeight: 700 }}>{pct}%</span>
                </div>
                <SegmentBar found={foundCount} total={total} />
              </div>

              {/* Figure dots */}
              <FigureGrid
                foundIds={foundIds}
                onFigureClick={(id) => {
                  onNavigate("map");
                }}
              />

              <p className="mt-3 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                Tap a figure to view on map
              </p>
            </motion.div>

            {/* ── Card 2: Player Stats ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.45 }}
              className="flex flex-col gap-5"
            >
              {/* Rank card */}
              <div
                className="rounded-3xl p-6 flex-1"
                style={{ background: "rgba(12,12,26,0.9)", border: `1.5px solid ${rank.color}28`, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em" }}>YOUR RANK</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span style={{ fontSize: "1.5rem" }}>{rank.icon}</span>
                      <h3 style={{ fontFamily: "'Righteous', sans-serif", fontSize: "1.25rem", color: rank.color }}>{rank.title}</h3>
                    </div>
                  </div>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: `${rank.color}16`,
                    border: `2px solid ${rank.color}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Shield size={22} color={rank.color} />
                  </div>
                </div>

                {/* XP bar */}
                {rank.next && (
                  <div>
                    <div className="flex justify-between text-xs mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                      <span>{xp} XP</span>
                      <span>{rank.next.minXP} XP — {rank.next.title}</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${rank.progress * 100}%` }}
                        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                        style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${rank.color}, ${rank.next.color})` }}
                      />
                    </div>
                  </div>
                )}
                {!rank.next && (
                  <div className="flex items-center gap-2">
                    <Star size={14} color="#FFE600" fill="#FFE600" />
                    <span style={{ color: "#FFE600", fontSize: "0.8rem", fontWeight: 700 }}>Maximum rank achieved!</span>
                  </div>
                )}
              </div>

              {/* Mini stats grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <Trophy size={18} color="#FFE600" />, val: String(foundCount), lbl: "Caught" },
                  { icon: <Zap size={18} color="#39FF14" />, val: String(xp), lbl: "XP" },
                  { icon: <MapPin size={18} color="#FF2D55" />, val: "1", lbl: "City" },
                ].map(({ icon, val, lbl }) => (
                  <div key={lbl} className="rounded-2xl p-3 flex flex-col items-center gap-1"
                    style={{ background: "rgba(12,12,26,0.9)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {icon}
                    <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: "1.1rem", color: "white", fontWeight: 900 }}>{val}</span>
                    <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>{lbl}</span>
                  </div>
                ))}
              </div>

              {/* Leaderboard teaser */}
              <button
                onClick={() => setComingSoonLabel(t.leaderboard)}
                className="rounded-2xl p-4 text-left w-full transition-all"
                style={{ background: "rgba(255,230,0,0.05)", border: "1.5px dashed rgba(255,230,0,0.25)", cursor: "pointer" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy size={16} color="#FFE600" />
                    <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: "0.85rem", color: "#FFE600" }}>LEADERBOARD</span>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "rgba(255,230,0,0.5)", fontWeight: 600 }}>COMING SOON →</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", marginTop: 4 }}>Compete with hunters city-wide</p>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FEATURE CARDS
      ══════════════════════════════════════════════════════════ */}
      <section style={{ background: "rgba(6,6,18,0.99)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">

          <div className="flex items-center gap-3 mb-6">
            <div style={{ width: 4, height: 22, borderRadius: 2, background: "linear-gradient(180deg,#0080FF,#39FF14)" }} />
            <h2 style={{ fontFamily: "'Righteous', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.7)", letterSpacing: "0.14em" }}>
              QUICK ACCESS
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {FEATURE_CARDS.map((card, i) => {
              const BG_IMGS = [
                "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=60",
                "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=60",
                "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=400&q=60",
                "https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&w=400&q=60",
                "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=60",
              ];
              return (
                <motion.button
                  key={card.label}
                  whileHover={{ scale: 1.04, y: -4 }} whileTap={{ scale: 0.95 }}
                  onClick={() => card.comingSoon ? setComingSoonLabel(card.label) : card.page && onNavigate(card.page)}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.38 }}
                  className="relative overflow-hidden rounded-2xl p-4 flex flex-col gap-2 text-left"
                  style={{ background: `linear-gradient(135deg, ${card.color}bb 0%, ${card.color}66 100%)`, border: `1.5px solid ${card.color}88`, minHeight: 120 }}
                >
                  <div className="absolute inset-0" style={{ backgroundImage: `url('${BG_IMGS[i]}')`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.12 }} />
                  <div className="relative z-10 text-white opacity-90">{card.icon}</div>
                  <div className="relative z-10">
                    <p className="text-white font-black text-sm tracking-wider leading-tight" style={{ fontFamily: "'Righteous', sans-serif" }}>{card.label}</p>
                    {card.sub.map(s => <p key={s} className="text-white/60 text-xs">{s}</p>)}
                    {card.comingSoon && <p className="text-yellow-300/70 text-xs mt-1 font-bold">🚀 {t.comingSoon}</p>}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 text-center py-4 flex items-center justify-center gap-2"
        style={{ background: "rgba(4,4,14,0.98)", borderTop: "1px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>
        {t.foundItKeepIt} <span className="text-lg">😊</span>
      </div>

      {/* ══════════════════════════════════════════════════════════
          COMING SOON MODAL
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {comingSoonLabel && <ComingSoonModal label={comingSoonLabel} onClose={() => setComingSoonLabel(null)} />}
      </AnimatePresence>
    </div>
  );
}
