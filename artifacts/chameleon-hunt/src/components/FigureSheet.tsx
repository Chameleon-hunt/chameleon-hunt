import { useState } from "react";
import { Figure, getFigureLocation } from "../lib/figures";
import { motion, AnimatePresence } from "framer-motion";
import { X, Navigation, Loader2, MapPin, ExternalLink } from "lucide-react";

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
}

export function FigureSheet({ figure, isFound, onClose, onFoundIt, onNavigate, navInfo }: FigureSheetProps) {
  const [navigating, setNavigating] = useState(false);
  const [navError, setNavError] = useState<string | null>(null);

  const handleNavigate = async () => {
    if (!figure) return;
    setNavigating(true);
    setNavError(null);
    try {
      const result = await onNavigate(figure);
      if (!result) {
        setNavError("Could not get your location. Make sure GPS is on and you've allowed location access.");
      }
    } catch {
      setNavError("Navigation unavailable. Try opening Google Maps instead.");
    } finally {
      setNavigating(false);
    }
  };

  const openGoogleMaps = () => {
    if (!figure) return;
    const [lat, lng] = getFigureLocation(figure);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`, "_blank");
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
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-[1001] overflow-y-auto"
            style={{
              background: "linear-gradient(180deg, #0a0a1a 0%, #0d0d22 100%)",
              borderTop: "4px solid #FF6B00",
              borderRadius: "28px 28px 0 0",
              maxHeight: "80vh",
              boxShadow: "0 -20px 60px rgba(255,107,0,0.25), 0 -4px 20px rgba(0,0,0,0.8)",
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-0">
              <div className="w-10 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="px-5 pt-3 pb-8">
              {/* Header with figure character */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-shrink-0">
                  <FigureSVG found={isFound} size={60} />
                </div>
                <div className="flex-grow">
                  <h2
                    className="font-display text-3xl text-white tracking-wide leading-none mb-2"
                    style={{ fontFamily: "'Righteous', sans-serif" }}
                  >
                    {figure.name}
                  </h2>
                  <span
                    className="inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest"
                    style={
                      isFound
                        ? { background: "rgba(57,255,20,0.15)", color: "#39FF14", border: "1px solid rgba(57,255,20,0.3)" }
                        : { background: "rgba(255,107,0,0.15)", color: "#FF6B00", border: "1px solid rgba(255,107,0,0.3)" }
                    }
                  >
                    {isFound ? "FOUND!" : "HIDDEN"}
                  </span>
                </div>
              </div>

              {/* Location hint */}
              <div
                className="rounded-2xl p-4 mb-4"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Location Hint
                </p>
                <p className="text-white text-base font-medium leading-snug">{figure.hint}</p>
              </div>

              {/* Navigation info */}
              {navInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 mb-4 flex items-center gap-3"
                  style={{ background: "rgba(0,128,255,0.15)", border: "1px solid rgba(0,128,255,0.3)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(0,128,255,0.25)" }}
                  >
                    <Navigation className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-xl leading-none mb-0.5">
                      {navInfo.etaMinutes} min walk
                    </p>
                    <p className="text-sm" style={{ color: "rgba(100,150,255,0.9)" }}>
                      {navInfo.distanceMeters < 1000
                        ? `${Math.round(navInfo.distanceMeters)} meters away`
                        : `${(navInfo.distanceMeters / 1000).toFixed(1)} km away`}
                    </p>
                  </div>
                  <button
                    onClick={openGoogleMaps}
                    className="ml-auto flex items-center gap-1 text-xs text-blue-300 font-semibold hover:text-blue-100 transition-colors"
                  >
                    Open Maps
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </motion.div>
              )}

              {/* Nav error */}
              {navError && (
                <div
                  className="rounded-2xl p-3 mb-4 text-sm"
                  style={{ background: "rgba(255,45,85,0.15)", border: "1px solid rgba(255,45,85,0.3)", color: "#ff6b8a" }}
                >
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
                    className="w-full py-4 rounded-2xl font-display text-2xl tracking-wider uppercase text-black active:scale-95 transition-transform"
                    style={{
                      fontFamily: "'Righteous', sans-serif",
                      background: "linear-gradient(135deg, #39FF14 0%, #00cc00 100%)",
                      boxShadow: "0 0 25px rgba(57,255,20,0.5), 0 4px 15px rgba(0,0,0,0.3)",
                    }}
                  >
                    Found It!
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={handleNavigate}
                      disabled={navigating}
                      className="flex-1 py-3 rounded-2xl font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
                      style={{
                        background: "linear-gradient(135deg, #0066FF 0%, #0044cc 100%)",
                        boxShadow: "0 0 15px rgba(0,102,255,0.35), 0 4px 10px rgba(0,0,0,0.3)",
                      }}
                    >
                      {navigating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Navigation className="w-4 h-4" />
                      )}
                      {navInfo ? "Reroute" : "Navigate"}
                    </button>
                    <button
                      onClick={openGoogleMaps}
                      className="py-3 px-5 rounded-2xl font-bold text-white flex items-center justify-center gap-1.5 active:scale-95 transition-transform text-sm"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Maps
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div
                    className="w-full py-4 rounded-2xl text-center font-display text-2xl tracking-wider uppercase text-black"
                    style={{
                      fontFamily: "'Righteous', sans-serif",
                      background: "linear-gradient(135deg, #39FF14 0%, #00cc00 100%)",
                    }}
                  >
                    Already Found!
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleNavigate}
                      disabled={navigating}
                      className="flex-1 py-3 rounded-2xl font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50 text-sm"
                      style={{
                        background: "rgba(0,102,255,0.3)",
                        border: "1px solid rgba(0,102,255,0.5)",
                      }}
                    >
                      {navigating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                      Navigate
                    </button>
                    <button
                      onClick={openGoogleMaps}
                      className="py-3 px-5 rounded-2xl font-bold text-white flex items-center justify-center gap-1.5 active:scale-95 transition-transform text-sm"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Maps
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function FigureSVG({ found, size = 56 }: { found: boolean; size?: number }) {
  const eye = found ? "#00aa00" : "#111111";
  const fill = found ? "#dfffdf" : "#ffffff";
  const s = size;
  const scale = s / 56;
  return (
    <svg
      viewBox="0 0 40 58"
      width={s * 0.72}
      height={s}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* Head */}
      <circle cx="20" cy="14" r="13" fill={fill} stroke={found ? "#00cc00" : "#ddd"} strokeWidth="0.5" />
      {/* Left eye */}
      <rect x="11" y="9" width="5" height="7" rx="1" fill={eye} />
      {/* Right eye */}
      <rect x="24" y="9" width="5" height="7" rx="1" fill={eye} />
      {/* Smile corners */}
      <rect x="10" y="18" width="2.5" height="2.5" fill={eye} />
      <rect x="27.5" y="18" width="2.5" height="2.5" fill={eye} />
      {/* Smile bar */}
      <rect x="12" y="20.5" width="16" height="3" rx="0.5" fill={eye} />
      {/* Body */}
      <ellipse cx="20" cy="44" rx="15" ry="16" fill={fill} stroke={found ? "#00cc00" : "#ddd"} strokeWidth="0.5" />
    </svg>
  );
}
