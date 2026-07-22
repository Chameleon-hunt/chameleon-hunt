import { useState } from "react";
import { Figure, getFigureLocation } from "../lib/figures";
import { motion, AnimatePresence } from "framer-motion";
import { X, Navigation, Loader2, MapPin, ExternalLink, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useLang } from "../lib/i18n";

export interface NavInfo {
  etaMinutes: number;
  distanceMeters: number;
  routeCoords: [number, number][];
  userCoords: [number, number];
}

interface FigureSheetProps {
  figure: Figure | null;
  isFound: boolean;
  onClose: () => void;
  onFoundIt: (figure: Figure) => void;
  onNavigate: (figure: Figure) => Promise<NavInfo | null>;
  navInfo: NavInfo | null;
  suppressClose?: boolean;
}

export function FigureSheet({ figure, isFound, onClose, onFoundIt, onNavigate, navInfo, suppressClose }: FigureSheetProps) {
  const { t } = useLang();
  const [navigating, setNavigating] = useState(false);
  const [navError, setNavError] = useState<string | null>(null);

  // Report state
  const [reporting, setReporting] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportStatus, setReportStatus] = useState<"idle" | "sent" | "error">("idle");

  const handleNavigate = async () => {
    if (!figure) return;
    setNavigating(true);
    setNavError(null);
    try {
      const result = await onNavigate(figure);
      if (!result) setNavError(t.navError);
    } catch {
      setNavError(t.navError);
    } finally {
      setNavigating(false);
    }
  };

  const openGoogleMaps = () => {
    if (!figure) return;
    const [lat, lng] = getFigureLocation(figure);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`, "_blank");
  };

  const submitReport = async () => {
    if (!figure) return;
    setReportSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("figure", figure.name);
      formData.append("report_type", "not_here");
      formData.append("location_hint", figure.hint);
      formData.append("_subject", `CHAMELEON HUNT — Missing Report: ${figure.name}`);
      const res = await fetch("https://formspree.io/f/xjgnoabr", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      setReportStatus("sent");
    } catch {
      setReportStatus("error");
    } finally {
      setReportSubmitting(false);
    }
  };

  const handleClose = () => {
    if (suppressClose) return;
    onClose();
  };

  return (
    <AnimatePresence>
      {figure && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000]"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}
            onClick={handleClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 340 }}
            className="fixed bottom-0 left-0 right-0 z-[1001] overflow-y-auto"
            style={{
              background: "linear-gradient(180deg, #0c0c20 0%, #0e0e28 100%)",
              borderTop: "3px solid #FF6B00",
              borderRadius: "28px 28px 0 0",
              maxHeight: "85vh",
              boxShadow: "0 -24px 80px rgba(255,107,0,0.22), 0 -4px 24px rgba(0,0,0,0.9)",
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3">
              <div className="w-12 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
            </div>

            {/* Title bar */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-sm font-bold tracking-widest" style={{ color: "rgba(255,107,0,0.9)", fontFamily: "'Righteous', sans-serif" }}>
                {isFound ? `✓ ${t.foundLabel}` : t.hiddenLabel}
              </p>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-90"
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 pt-4 pb-10">
              {/* Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-shrink-0">
                  <FigureSVG found={isFound} size={64} />
                </div>
                <div className="flex-grow">
                  <h2 className="font-display text-2xl text-white tracking-wide leading-none mb-2" style={{ fontFamily: "'Righteous', sans-serif" }}>
                    {figure.name}
                  </h2>
                  <span
                    className="inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest"
                    style={
                      isFound
                        ? { background: "rgba(57,255,20,0.18)", color: "#39FF14", border: "1px solid rgba(57,255,20,0.35)" }
                        : { background: "rgba(255,107,0,0.15)", color: "#FF6B00", border: "1px solid rgba(255,107,0,0.3)" }
                    }
                  >
                    {isFound ? t.foundLabel : t.hiddenLabel}
                  </span>
                </div>
              </div>

              {/* Location hint */}
              <div
                className="rounded-2xl p-4 mb-4"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {t.locationHint}
                </p>
                <p className="text-white text-base font-medium leading-snug">{figure.hint}</p>
              </div>

              {/* Navigation ETA */}
              {navInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 mb-4 flex items-center gap-3"
                  style={{ background: "rgba(0,128,255,0.13)", border: "1px solid rgba(0,128,255,0.28)" }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,128,255,0.22)" }}>
                    <Navigation className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-white font-bold text-xl leading-none mb-0.5">
                      {navInfo.etaMinutes} {t.minWalk}
                    </p>
                    <p className="text-sm" style={{ color: "rgba(100,160,255,0.9)" }}>
                      {navInfo.distanceMeters < 1000
                        ? `${Math.round(navInfo.distanceMeters)} ${t.metersAway}`
                        : `${(navInfo.distanceMeters / 1000).toFixed(1)} ${t.kmAway}`}
                    </p>
                  </div>
                  <button onClick={openGoogleMaps} className="flex items-center gap-1 text-xs text-blue-300 font-semibold">
                    {t.openMaps} <ExternalLink className="w-3 h-3" />
                  </button>
                </motion.div>
              )}

              {/* Nav error */}
              {navError && (
                <div className="rounded-2xl p-3 mb-4 text-sm" style={{ background: "rgba(255,45,85,0.12)", border: "1px solid rgba(255,45,85,0.28)", color: "#ff8099" }}>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{navError}</span>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              {!isFound ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => onFoundIt(figure)}
                    className="w-full py-4 rounded-2xl font-display text-xl tracking-wider uppercase text-black active:scale-95 transition-transform"
                    style={{
                      fontFamily: "'Righteous', sans-serif",
                      background: "linear-gradient(135deg, #39FF14 0%, #00cc00 100%)",
                      boxShadow: "0 0 28px rgba(57,255,20,0.5), 0 4px 15px rgba(0,0,0,0.3)",
                    }}
                  >
                    {t.foundIt}
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={handleNavigate}
                      disabled={navigating}
                      className="flex-1 py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
                      style={{
                        background: "linear-gradient(135deg, #0066FF 0%, #0044cc 100%)",
                        boxShadow: "0 0 15px rgba(0,102,255,0.3), 0 4px 10px rgba(0,0,0,0.3)",
                      }}
                    >
                      {navigating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                      {navInfo ? t.reroute : t.navigate}
                    </button>
                    <button
                      onClick={openGoogleMaps}
                      className="py-3.5 px-5 rounded-2xl font-bold text-white flex items-center justify-center gap-1.5 active:scale-95 transition-transform text-sm"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)" }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      {t.mapsBtn}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div
                    className="w-full py-4 rounded-2xl text-center text-xl tracking-wider uppercase text-black"
                    style={{ fontFamily: "'Righteous', sans-serif", background: "linear-gradient(135deg, #39FF14 0%, #00cc00 100%)" }}
                  >
                    {t.alreadyFound}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleNavigate}
                      disabled={navigating}
                      className="flex-1 py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50 text-sm"
                      style={{ background: "rgba(0,102,255,0.25)", border: "1px solid rgba(0,102,255,0.45)" }}
                    >
                      {navigating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                      {t.navigate}
                    </button>
                    <button
                      onClick={openGoogleMaps}
                      className="py-3.5 px-5 rounded-2xl font-bold text-white flex items-center justify-center gap-1.5 active:scale-95 transition-transform text-sm"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)" }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      {t.mapsBtn}
                    </button>
                  </div>
                </div>
              )}

              {/* ── Report section ── */}
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                {!reporting ? (
                  <button
                    onClick={() => { setReporting(true); setReportStatus("idle"); }}
                    className="w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
                    style={{ background: "rgba(255,150,0,0.08)", border: "1px solid rgba(255,150,0,0.2)", color: "rgba(255,150,0,0.8)" }}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {t.reportBtn}
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-4"
                    style={{ background: "rgba(255,150,0,0.08)", border: "1px solid rgba(255,150,0,0.22)" }}
                  >
                    {reportStatus === "sent" ? (
                      <div className="flex items-center gap-3 text-green-400">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <span className="font-bold text-sm">{t.reportSent}</span>
                      </div>
                    ) : reportStatus === "error" ? (
                      <div className="flex items-center gap-3" style={{ color: "#ff8099" }}>
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">{t.reportError}</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-white font-bold text-sm mb-1">{t.reportTitle}</p>
                        <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{t.reportDesc}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setReporting(false)}
                            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}
                          >
                            {t.cancel}
                          </button>
                          <button
                            onClick={submitReport}
                            disabled={reportSubmitting}
                            className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            style={{ background: "rgba(255,150,0,0.25)", color: "#ff9600", border: "1px solid rgba(255,150,0,0.4)" }}
                          >
                            {reportSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            {t.submitReport}
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Improved character SVG (matches 3D blob style) ────────────────────────────
export function FigureSVG({ found, size = 56 }: { found: boolean; size?: number }) {
  const fill = found ? "#ccffcc" : "#ffffff";
  const stroke = found ? "#00cc00" : "#d4d4d4";
  const eye = found ? "#006600" : "#111111";
  return (
    <svg viewBox="0 0 44 64" width={size * 0.72} height={size} xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <defs>
        <radialGradient id={`fg-${found ? 'f' : 'h'}`} cx="38%" cy="30%" r="65%">
          <stop offset="0%" stopColor="white" />
          <stop offset="70%" stopColor={fill} />
          <stop offset="100%" stopColor={stroke} />
        </radialGradient>
      </defs>
      {/* Head */}
      <circle cx="22" cy="16" r="14" fill={`url(#fg-${found ? 'f' : 'h'})`} />
      {/* Eyes */}
      <rect x="13" y="11" width="6" height="8" rx="2" fill={eye} />
      <rect x="25" y="11" width="6" height="8" rx="2" fill={eye} />
      {/* Smile */}
      <path d="M 14 23 Q 22 30 30 23" stroke={eye} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="22" cy="48" rx="14" ry="16" fill={`url(#fg-${found ? 'f' : 'h'})`} />
      {/* Left arm raised */}
      <ellipse cx="7" cy="36" rx="5" ry="11" fill={`url(#fg-${found ? 'f' : 'h'})`} transform="rotate(-45 7 36)" />
      {/* Right arm */}
      <ellipse cx="37" cy="42" rx="5" ry="10" fill={`url(#fg-${found ? 'f' : 'h'})`} transform="rotate(20 37 42)" />
    </svg>
  );
}
