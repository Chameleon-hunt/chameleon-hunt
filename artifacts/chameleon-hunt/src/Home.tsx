import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Trophy, HelpCircle, ShoppingBag, Users, ChevronDown, MapPin, X } from "lucide-react";
import type { Page } from "./App";
import { useLang, LANG_LABELS, type Lang } from "./lib/i18n";
import { UserMenu } from "./components/UserMenu";

// ── Big 3D character (matches reference image) ────────────────────────────────
export function BigCharacter() {
  return (
    <svg
      viewBox="0 0 240 430"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", filter: "drop-shadow(0 30px 80px rgba(0,0,0,0.6))" }}
    >
      <defs>
        <radialGradient id="hG2" cx="35%" cy="28%" r="65%">
          <stop offset="0%" stopColor="white" />
          <stop offset="50%" stopColor="#f4f4f4" />
          <stop offset="100%" stopColor="#c8c8c8" />
        </radialGradient>
        <radialGradient id="bG2" cx="38%" cy="26%" r="68%">
          <stop offset="0%" stopColor="white" />
          <stop offset="55%" stopColor="#efefef" />
          <stop offset="100%" stopColor="#c0c0c0" />
        </radialGradient>
        <radialGradient id="aG2" cx="40%" cy="32%" r="62%">
          <stop offset="0%" stopColor="#f8f8f8" />
          <stop offset="100%" stopColor="#b8b8b8" />
        </radialGradient>
        <radialGradient id="sG2" cx="30%" cy="28%" r="60%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="#cccccc" />
        </radialGradient>
      </defs>

      {/* ── Left arm raised (above head level) ── */}
      <ellipse cx="36" cy="176" rx="22" ry="62" fill="url(#aG2)" transform="rotate(-52 36 176)" />
      <ellipse cx="16" cy="120" rx="18" ry="28" fill="url(#aG2)" transform="rotate(-35 16 120)" />
      <circle cx="8" cy="102" r="22" fill="url(#hG2)" />
      <ellipse cx="-4" cy="88" rx="9" ry="16" fill="url(#hG2)" transform="rotate(-30 -4 88)" />
      <ellipse cx="3" cy="97" rx="8" ry="6" fill="white" opacity="0.5" transform="rotate(-20 3 97)" />

      {/* ── Head ── */}
      <circle cx="128" cy="110" r="98" fill="url(#hG2)" />
      <ellipse cx="95" cy="74" rx="30" ry="19" fill="white" opacity="0.58" transform="rotate(-28 95 74)" />
      <ellipse cx="162" cy="80" rx="12" ry="8" fill="white" opacity="0.28" />

      {/* ── Eyes ── */}
      <rect x="89" y="90" width="26" height="30" rx="7" fill="#111" />
      <rect x="143" y="90" width="26" height="30" rx="7" fill="#111" />
      <rect x="94" y="95" width="9" height="10" rx="3" fill="#444" />
      <rect x="148" y="95" width="9" height="10" rx="3" fill="#444" />

      {/* ── Smile ── */}
      <path d="M 88 132 Q 128 168 168 132" stroke="#111" strokeWidth="7" fill="none" strokeLinecap="round" />

      {/* ── Body ── */}
      <ellipse cx="128" cy="305" rx="72" ry="90" fill="url(#bG2)" />
      <ellipse cx="104" cy="262" rx="20" ry="32" fill="white" opacity="0.35" transform="rotate(-14 104 262)" />

      {/* ── Right arm ── */}
      <ellipse cx="208" cy="262" rx="22" ry="54" fill="url(#aG2)" transform="rotate(22 208 262)" />
      <circle cx="218" cy="312" r="20" fill="url(#sG2)" />
      <ellipse cx="212" cy="306" rx="8" ry="6" fill="white" opacity="0.42" />

      {/* ── Left leg ── */}
      <ellipse cx="102" cy="386" rx="30" ry="38" fill="url(#aG2)" />
      <ellipse cx="95" cy="380" rx="12" ry="8" fill="white" opacity="0.32" />
      <ellipse cx="100" cy="416" rx="26" ry="16" fill="url(#aG2)" />

      {/* ── Right leg ── */}
      <ellipse cx="154" cy="386" rx="30" ry="38" fill="url(#aG2)" />
      <ellipse cx="147" cy="380" rx="12" ry="8" fill="white" opacity="0.32" />
      <ellipse cx="152" cy="416" rx="26" ry="16" fill="url(#aG2)" />
    </svg>
  );
}

// ── Logo mark ─────────────────────────────────────────────────────────────────
export function LogoMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? 0.72 : size === "lg" ? 1.3 : 1;
  return (
    <div
      style={{
        background: "linear-gradient(145deg, #0a0a1a 0%, #111128 100%)",
        border: "2px solid rgba(255,255,255,0.10)",
        borderRadius: 14 * s,
        padding: `${8 * s}px ${12 * s}px`,
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        lineHeight: 1.05,
        boxShadow: "0 4px 20px rgba(0,0,0,0.55)",
      }}
    >
      <span style={{ fontFamily: "'Righteous', sans-serif", fontSize: 17 * s, fontWeight: 900, color: "white", letterSpacing: "0.06em" }}>
        CHAMELEON
      </span>
      <span style={{ display: "flex", gap: 1, fontSize: 19 * s, fontFamily: "'Righteous', sans-serif", fontWeight: 900 }}>
        {(["H","U","N","T"] as const).map((l, i) => (
          <span key={l} style={{ color: ["#FF2D55","#39FF14","#0080FF","#FFE600"][i] }}>{l}</span>
        ))}
      </span>
    </div>
  );
}

// ── Coming Soon Modal ─────────────────────────────────────────────────────────
function ComingSoonModal({ label, onClose }: { label: string; onClose: () => void }) {
  const { t } = useLang();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="rounded-3xl p-8 text-center max-w-sm w-full"
        style={{
          background: "linear-gradient(145deg, #0c0c22, #131330)",
          border: "2px solid rgba(255,255,255,0.12)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
        }}
      >
        <div className="text-5xl mb-4">🚀</div>
        <h2 className="text-white text-3xl font-black mb-2" style={{ fontFamily: "'Righteous', sans-serif" }}>
          {label}
        </h2>
        <p className="text-3xl font-black mb-1" style={{ fontFamily: "'Righteous', sans-serif", color: "#FF6B00" }}>
          {t.comingSoon}
        </p>
        <p className="mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>{t.comingSoonSub}</p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl font-bold text-white"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          {t.back}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Language Picker ───────────────────────────────────────────────────────────
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
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 rounded-2xl overflow-hidden z-50"
            style={{
              background: "rgba(12,12,28,0.98)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
              minWidth: 130,
              right: 0,
            }}
          >
            {langs.map(l => (
              <button
                key={l}
                onClick={() => { setLang(l); setOpen(false); }}
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

// ── Feature card data ─────────────────────────────────────────────────────────
const CARD_COLORS = ["#1a6dcc", "#1a7a40", "#b8860b", "#6a0dad", "#6b3020"];
const CARD_BG = [
  "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=60",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=60",
  "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=400&q=60",
  "https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&w=400&q=60",
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=60",
];

const NAV_LINKS: Array<{ key: keyof ReturnType<typeof useLang>["t"]; page: Page | null; comingSoon?: boolean }> = [
  { key: "home", page: "home" },
  { key: "map", page: "map" },
  { key: "characters", page: "characters" },
  { key: "leaderboard", page: null, comingSoon: true },
  { key: "howToPlay", page: "howtoplay" },
];

// ── Main Home component ───────────────────────────────────────────────────────
export function Home({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { t } = useLang();
  const [comingSoonLabel, setComingSoonLabel] = useState<string | null>(null);

  const FEATURE_CARDS = [
    { page: "map" as Page, label: t.theMap, sub: [t.exploreCities, t.findCharacters], icon: <Map className="w-8 h-8" />, comingSoon: false },
    { page: "characters" as Page, label: t.characters, sub: [t.discoverAll], icon: <Users className="w-8 h-8" />, comingSoon: false },
    { page: null, label: t.leaderboard, sub: [t.topHunters], icon: <Trophy className="w-8 h-8" />, comingSoon: true },
    { page: "howtoplay" as Page, label: t.howToPlay, sub: [t.easyToLearn, t.hardToMaster], icon: <HelpCircle className="w-8 h-8" />, comingSoon: false },
    { page: null, label: t.map, sub: [t.getCoolGear], icon: <ShoppingBag className="w-8 h-8" />, comingSoon: true },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "#08081a", fontFamily: "'Outfit', sans-serif" }}>

      {/* ══ NAVBAR ══ */}
      <nav
        className="relative z-30 flex items-center justify-between px-4 md:px-6 py-2.5"
        style={{ background: "rgba(6,6,18,0.94)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button onClick={() => onNavigate("home")} className="flex-shrink-0">
          <LogoMark size="sm" />
        </button>

        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ key, page, comingSoon }) => (
            <button
              key={key}
              onClick={() => comingSoon ? setComingSoonLabel(t[key] as string) : page && onNavigate(page)}
              className="text-xs font-bold tracking-widest transition-colors hover:text-white"
              style={{ fontFamily: "'Righteous', sans-serif", color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em" }}
            >
              {t[key] as string}
            </button>
          ))}
        </div>

        {/* Right: lang + user menu */}
        <div className="flex items-center gap-2.5">
          <LangPicker />
          <UserMenu />
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="relative flex-grow flex flex-col" style={{ minHeight: "calc(100dvh - 56px)" }}>
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=80')`,
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
            }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(4,4,16,0.97) 0%, rgba(4,4,16,0.85) 32%, rgba(4,4,16,0.3) 58%, transparent 75%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-64" style={{ background: "linear-gradient(to top, rgba(4,4,14,1) 0%, transparent 100%)" }} />
          <div className="absolute top-0 left-0 right-0 h-24" style={{ background: "linear-gradient(to bottom, rgba(4,4,14,0.65) 0%, transparent 100%)" }} />
        </div>

        {/* Content grid */}
        <div className="relative z-10 flex-grow flex items-center px-5 md:px-10 lg:px-16 pt-6 pb-4">
          <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6 items-center">

            {/* Left: text */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col gap-4"
            >
              <div>
                <h1
                  className="text-white uppercase leading-none"
                  style={{ fontFamily: "'Righteous', sans-serif", fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 900 }}
                >
                  CHAMELEON
                </h1>
                <div style={{ display: "flex", gap: "clamp(6px, 1.5vw, 16px)", lineHeight: 1, fontSize: "clamp(3.5rem, 9vw, 7.5rem)", fontFamily: "'Righteous', sans-serif", fontWeight: 900 }}>
                  {(["H","U","N","T"] as const).map((letter, i) => {
                    const color = ["#FF2D55","#39FF14","#0080FF","#FFE600"][i];
                    return (
                      <motion.span
                        key={letter}
                        style={{ color, display: "inline-block", textShadow: `0 0 40px ${color}77` }}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + i * 0.06, duration: 0.45 }}
                      >
                        {letter}
                      </motion.span>
                    );
                  })}
                </div>
              </div>

              <p className="text-white font-bold text-lg md:text-xl leading-snug whitespace-pre-line" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
                {t.tagline}
              </p>

              <motion.button
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55, duration: 0.4 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate("map")}
                className="self-start flex items-center gap-3 font-bold uppercase text-white rounded-full"
                style={{
                  fontFamily: "'Righteous', sans-serif",
                  fontSize: "1.05rem",
                  letterSpacing: "0.1em",
                  background: "linear-gradient(135deg, #ff2d55 0%, #d4001a 100%)",
                  padding: "14px 36px",
                  boxShadow: "0 8px 32px rgba(255,45,85,0.5), 0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                {t.startHunt} <span style={{ fontSize: "1.25em" }}>→</span>
              </motion.button>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="flex flex-wrap gap-3"
              >
                {[
                  { icon: <Trophy className="w-4 h-4 text-yellow-400" />, n: "11+", label: t.charactersHidden },
                  { icon: <MapPin className="w-4 h-4 text-red-400" />, n: "1", label: t.cityActive },
                ].map(({ icon, n, label }) => (
                  <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-2xl" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {icon}
                    <span className="text-white font-bold text-sm">{n} </span>
                    <span className="text-white/55 text-xs">{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: character */}
            <motion.div
              initial={{ opacity: 0, x: 50, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative flex items-end justify-center"
              style={{ minHeight: "clamp(300px, 55vh, 600px)" }}
            >
              <div style={{ position: "absolute", bottom: 0, right: "clamp(-20px, 2vw, 30px)", width: "clamp(240px, 40vw, 500px)", height: "clamp(340px, 58vh, 680px)" }}>
                <BigCharacter />
              </div>

              {/* NEW CITY ADDED badge */}
              <motion.div
                initial={{ scale: 0, rotate: -24 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.85, type: "spring", stiffness: 200, damping: 12 }}
                className="absolute flex flex-col items-center justify-center text-center rounded-full z-20"
                style={{
                  bottom: "34%",
                  right: "clamp(200px, 38vw, 440px)",
                  width: 106, height: 106,
                  background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
                  border: "3px solid rgba(255,255,255,0.22)",
                  boxShadow: "0 8px 32px rgba(124,58,237,0.55)",
                }}
              >
                <span className="text-yellow-300 font-black text-xs leading-none tracking-widest" style={{ fontFamily: "'Righteous', sans-serif" }}>NEW</span>
                <span className="text-white font-black text-xs leading-tight mt-1 whitespace-pre-line tracking-wide" style={{ fontSize: 10 }}>{t.newCityAdded}</span>
              </motion.div>

              {/* FIND THEM card */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95, duration: 0.5 }}
                className="absolute top-4 right-2 rounded-2xl p-4 text-right hidden md:block"
                style={{ background: "rgba(8,8,24,0.88)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(12px)", maxWidth: 190 }}
              >
                <p className="text-white font-black text-base leading-snug whitespace-pre-line" style={{ fontFamily: "'Righteous', sans-serif" }}>
                  {t.findThemTitle}
                </p>
                <div className="flex justify-end mt-2"><span className="text-2xl">⭐</span></div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ══ FEATURE CARDS ══ */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.55 }}
          className="relative z-10 px-4 pb-5 pt-2"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-6xl mx-auto">
            {FEATURE_CARDS.map((card, i) => (
              <motion.button
                key={card.label}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => card.comingSoon ? setComingSoonLabel(card.label) : card.page && onNavigate(card.page)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.07, duration: 0.4 }}
                className="relative overflow-hidden rounded-2xl p-4 flex flex-col gap-2 text-left"
                style={{ background: `linear-gradient(135deg, ${CARD_COLORS[i]}bb 0%, ${CARD_COLORS[i]}66 100%)`, border: `1.5px solid ${CARD_COLORS[i]}88`, minHeight: 126 }}
              >
                <div className="absolute inset-0" style={{ backgroundImage: `url('${CARD_BG[i]}')`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15 }} />
                <div className="relative z-10 text-white opacity-90">{card.icon}</div>
                <div className="relative z-10">
                  <p className="text-white font-black text-sm tracking-wider leading-tight" style={{ fontFamily: "'Righteous', sans-serif" }}>{card.label}</p>
                  {card.sub.map(s => <p key={s} className="text-white/60 text-xs">{s}</p>)}
                  {card.comingSoon && <p className="text-yellow-300/70 text-xs mt-1 font-bold">🚀 {t.comingSoon}</p>}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ FOOTER ══ */}
      <div
        className="relative z-10 text-center py-3 text-white/45 text-sm font-medium flex items-center justify-center gap-2"
        style={{ background: "rgba(4,4,14,0.98)", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        {t.foundItKeepIt.replace("?", "?")} <span className="text-lg">😊</span>
      </div>

      {/* ══ COMING SOON MODAL ══ */}
      <AnimatePresence>
        {comingSoonLabel && (
          <ComingSoonModal label={comingSoonLabel} onClose={() => setComingSoonLabel(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
