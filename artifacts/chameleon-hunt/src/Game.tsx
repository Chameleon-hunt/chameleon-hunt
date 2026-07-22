import { useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FIGURES, Figure, getFigureLocation } from "./lib/figures";
import { CameraModal } from "./components/CameraModal";
import { FigureSheet, NavInfo, FigureSVG } from "./components/FigureSheet";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, RefreshCw, Check, Map, Users, HelpCircle, ArrowLeft, Target } from "lucide-react";
import { LogoMark } from "./Home";
import { useLang } from "./lib/i18n";
import type { Page } from "./App";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

// ── Custom marker icons ───────────────────────────────────────────────────────
function makeFigureIcon(found: boolean) {
  const eyeColor = found ? "#00aa00" : "#111111";
  const fillColor = found ? "#d4ffd4" : "#ffffff";
  const glow = found
    ? "filter:drop-shadow(0 0 10px #39FF14) drop-shadow(0 0 4px #39FF14);"
    : "filter:drop-shadow(0 2px 8px rgba(0,0,0,0.55));";

  const dot = !found
    ? `<div style="position:absolute;top:-5px;right:-7px;width:14px;height:14px;background:#FF6B00;border-radius:50%;border:2.5px solid white;animation:markerPulse 1.5s infinite;"></div>`
    : "";

  const svg = `<svg viewBox="0 0 44 64" width="42" height="60" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="mgx${found?1:0}" cx="36%" cy="28%" r="65%">
        <stop offset="0%" stop-color="white"/>
        <stop offset="65%" stop-color="${fillColor}"/>
        <stop offset="100%" stop-color="${found?"#aaddaa":"#cccccc"}"/>
      </radialGradient>
    </defs>
    <circle cx="22" cy="16" r="14" fill="url(#mgx${found?1:0})"/>
    <rect x="13" y="11" width="6" height="8" rx="2" fill="${eyeColor}"/>
    <rect x="25" y="11" width="6" height="8" rx="2" fill="${eyeColor}"/>
    <path d="M14 23 Q22 30 30 23" stroke="${eyeColor}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <ellipse cx="22" cy="48" rx="14" ry="16" fill="url(#mgx${found?1:0})"/>
    <ellipse cx="8" cy="38" rx="5" ry="11" fill="url(#mgx${found?1:0})" transform="rotate(-45 8 38)"/>
    <ellipse cx="36" cy="42" rx="5" ry="10" fill="url(#mgx${found?1:0})" transform="rotate(22 36 42)"/>
  </svg>`;

  return L.divIcon({
    className: "",
    html: `<div style="position:relative;${glow}">${svg}${dot}</div>`,
    iconSize: [42, 60],
    iconAnchor: [21, 60],
    popupAnchor: [0, -62],
  });
}

const userLocIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;background:#0080FF;border-radius:50%;border:3px solid white;box-shadow:0 0 0 5px rgba(0,128,255,0.22),0 2px 8px rgba(0,0,0,0.4);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// ── Map helpers ───────────────────────────────────────────────────────────────
function MapController({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  if (center) map.setView(center, zoom ?? map.getZoom(), { animate: true });
  return null;
}
function BoundsController({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
  const map = useMap();
  if (bounds) map.fitBounds(bounds, { padding: [60, 60], maxZoom: 17, animate: true });
  return null;
}
function MapTapHandler({ onTap }: { onTap: () => void }) {
  useMapEvents({ click: onTap });
  return null;
}

// ── Card colours ──────────────────────────────────────────────────────────────
const CARD_COLORS = ["#FF2D55","#FF6B00","#FFE600","#39FF14","#0080FF","#9B59B6","#FF2D55","#FF6B00","#FFE600","#39FF14","#0080FF"];

// ── Characters sub-view ───────────────────────────────────────────────────────
function CharactersView({ foundIds, onSelect }: { foundIds: number[]; onSelect: (f: Figure) => void }) {
  const { t } = useLang();
  return (
    <div className="flex-grow p-5 md:p-8">
      <h2 className="text-white mb-6 flex items-center gap-3" style={{ fontFamily: "'Righteous', sans-serif", fontSize: "1.7rem", letterSpacing: "0.05em" }}>
        <Users className="text-orange-400 w-6 h-6" />
        {t.charactersTitle}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-16">
        {FIGURES.map((fig, idx) => {
          const isFound = foundIds.includes(fig.id);
          const color = CARD_COLORS[idx % CARD_COLORS.length];
          return (
            <button
              key={fig.id}
              onClick={() => onSelect(fig)}
              className="w-full text-left relative overflow-hidden rounded-3xl p-5 transition-all duration-200 active:scale-[0.97]"
              style={{
                background: "rgba(12,12,26,0.95)",
                border: `2px solid ${isFound ? "#39FF14" : color}44`,
                boxShadow: isFound ? `0 0 20px ${color}22` : `0 4px 18px rgba(0,0,0,0.4)`,
              }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl" style={{ background: isFound ? "#39FF14" : color }} />
              <div className="flex items-start gap-3 ml-2">
                <div className="flex-shrink-0"><FigureSVG found={isFound} size={48} /></div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start mb-1.5 gap-2">
                    <h3 className="text-white font-bold text-base leading-tight" style={{ fontFamily: "'Righteous', sans-serif" }}>{fig.name}</h3>
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 flex items-center gap-1"
                      style={isFound ? { background: "rgba(57,255,20,0.15)", color: "#39FF14", border: "1px solid rgba(57,255,20,0.3)" } : { background: `${color}18`, color, border: `1px solid ${color}35` }}
                    >
                      {isFound && <Check className="w-3 h-3" />}
                      {isFound ? t.foundLabel : t.hiddenLabel}
                    </span>
                  </div>
                  <p className="text-xs leading-snug" style={{ color: "rgba(255,255,255,0.5)" }}>{fig.hint}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── How to Play sub-view ──────────────────────────────────────────────────────
function HowToPlayView() {
  const { t } = useLang();
  const steps = [
    { n: "01", color: "#FF2D55", title: t.step1title, body: t.step1body },
    { n: "02", color: "#FFE600", title: t.step2title, body: t.step2body },
    { n: "03", color: "#39FF14", title: t.step3title, body: t.step3body },
    { n: "04", color: "#0080FF", title: t.step4title, body: t.step4body },
  ];
  return (
    <div className="flex-grow p-5 md:p-8">
      <h2 className="text-white mb-6 flex items-center gap-3" style={{ fontFamily: "'Righteous', sans-serif", fontSize: "1.7rem", letterSpacing: "0.05em" }}>
        <HelpCircle className="text-orange-400 w-6 h-6" />
        {t.howToPlayTitle}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 max-w-3xl">
        {steps.map(({ n, color, title, body }) => (
          <div key={n} className="rounded-3xl p-5" style={{ background: "rgba(12,12,26,0.95)", border: `2px solid ${color}44` }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-base mb-3" style={{ background: `${color}20`, color, fontFamily: "'Righteous', sans-serif", border: `2px solid ${color}44` }}>
              {n}
            </div>
            <h3 className="text-white font-bold text-base mb-1.5" style={{ fontFamily: "'Righteous', sans-serif" }}>{title}</h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{body}</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl p-5 max-w-3xl mb-12" style={{ background: "rgba(57,255,20,0.06)", border: "2px solid rgba(57,255,20,0.22)" }}>
        <p className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Righteous', sans-serif" }}>{t.keepItMsg}</p>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{t.keepItSub}</p>
      </div>
    </div>
  );
}

// ── Inner tabs ────────────────────────────────────────────────────────────────
const INNER_TABS: Array<{ page: Page; icon: React.ReactNode; tKey: "map" | "characters" | "howToPlay" }> = [
  { page: "map",        icon: <Map className="w-4 h-4" />,      tKey: "map" },
  { page: "characters", icon: <Users className="w-4 h-4" />,    tKey: "characters" },
  { page: "howtoplay",  icon: <HelpCircle className="w-4 h-4" />, tKey: "howToPlay" },
];

// ── Main Game component ───────────────────────────────────────────────────────
export function Game({ activePage, onNavigate }: { activePage: Page; onNavigate: (page: Page) => void }) {
  const { t } = useLang();

  const [foundIds, setFoundIds] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem("chameleon_hunt_found") ?? "[]"); }
    catch { return []; }
  });

  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
  const [mapZoom, setMapZoom] = useState<number | undefined>(undefined);
  const [mapBounds, setMapBounds] = useState<L.LatLngBoundsExpression | null>(null);
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraFigure, setCameraFigure] = useState<Figure | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [navInfo, setNavInfo] = useState<NavInfo | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  const openFigure = (fig: Figure) => {
    setSelectedFigure(fig);
    setNavInfo(null);
    setRouteCoords([]);
    setUserLocation(null);
    setMapBounds(null);
    setMapCenter(getFigureLocation(fig));
    setMapZoom(17);
    if (activePage !== "map") onNavigate("map");
  };

  const closeSheet = () => {
    setSelectedFigure(null);
    setNavInfo(null);
    setRouteCoords([]);
    setUserLocation(null);
    setMapBounds(null);
  };

  const handleFoundIt = (fig: Figure) => {
    setCameraFigure(fig);
    setCameraOpen(true);
  };

  const handleFoundSuccess = (id: number) => {
    const next = [...new Set([...foundIds, id])];
    setFoundIds(next);
    localStorage.setItem("chameleon_hunt_found", JSON.stringify(next));
    // Close camera ONLY — do NOT close the sheet
    setCameraOpen(false);
    closeSheet();
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 3500);
  };

  const handleNavigate = useCallback(async (fig: Figure): Promise<NavInfo | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) { resolve(null); return; }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const uLat = pos.coords.latitude;
          const uLng = pos.coords.longitude;
          const [fLat, fLng] = getFigureLocation(fig);
          try {
            const res = await fetch(`https://router.project-osrm.org/route/v1/walking/${uLng},${uLat};${fLng},${fLat}?overview=full&geometries=geojson`);
            const data = await res.json();
            if (!data.routes?.length) { resolve(null); return; }
            const route = data.routes[0];
            const coords: [number, number][] = route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as [number, number]);
            const info: NavInfo = {
              etaMinutes: Math.max(1, Math.ceil(route.duration / 60)),
              distanceMeters: Math.round(route.distance),
              routeCoords: coords,
              userCoords: [uLat, uLng],
            };
            setNavInfo(info);
            setUserLocation([uLat, uLng]);
            setRouteCoords(coords);
            setMapCenter(undefined);
            setMapZoom(undefined);
            setMapBounds([[uLat, uLng], [fLat, fLng]]);
            resolve(info);
          } catch { resolve(null); }
        },
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );
    });
  }, []);

  const resetGame = () => {
    if (window.confirm(t.resetConfirm)) {
      setFoundIds([]);
      localStorage.removeItem("chameleon_hunt_found");
    }
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, #08081a 0%, #060614 100%)",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* ── HERO HEADER (matches lobby style) ── */}
      <div
        className="relative flex-shrink-0"
        style={{
          background: "linear-gradient(180deg, rgba(6,6,20,0.98) 0%, rgba(8,8,26,0.95) 100%)",
          borderBottom: "1px solid rgba(255,107,0,0.18)",
        }}
      >
        {/* Subtle colour blobs */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: -30, left: -40, width: 180, height: 160, background: "#FF2D55", borderRadius: "50%", filter: "blur(60px)", opacity: 0.07 }} />
          <div style={{ position: "absolute", top: -20, right: -30, width: 200, height: 140, background: "#0080FF", borderRadius: "50%", filter: "blur(60px)", opacity: 0.07 }} />
        </div>

        {/* Nav row */}
        <nav className="relative z-10 flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-1.5 text-white/55 hover:text-white transition-colors text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t.back}</span>
            </button>
            <button onClick={() => onNavigate("home")}>
              <LogoMark size="sm" />
            </button>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center gap-1">
            {INNER_TABS.map(({ page, icon, tKey }) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  fontFamily: "'Righteous', sans-serif",
                  background: activePage === page ? "rgba(255,107,0,0.18)" : "transparent",
                  color: activePage === page ? "#FF6B00" : "rgba(255,255,255,0.45)",
                  border: activePage === page ? "1px solid rgba(255,107,0,0.38)" : "1px solid transparent",
                  letterSpacing: "0.04em",
                }}
              >
                {icon}
                <span className="hidden sm:inline">{t[tKey]}</span>
              </button>
            ))}
          </div>

          {/* Score badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.22)" }}
          >
            <Target className="w-4 h-4 text-orange-400" />
            <span className="text-white font-bold text-sm">{foundIds.length}/{FIGURES.length}</span>
          </div>
        </nav>

        {/* Page title strip */}
        <div className="relative z-10 px-4 pb-3 flex items-center gap-3">
          {activePage === "map" && <><Map className="w-5 h-5 text-orange-400" /><span className="text-white font-bold tracking-widest text-sm uppercase" style={{ fontFamily: "'Righteous', sans-serif" }}>{t.map}</span></>}
          {activePage === "characters" && <><Users className="w-5 h-5 text-orange-400" /><span className="text-white font-bold tracking-widest text-sm uppercase" style={{ fontFamily: "'Righteous', sans-serif" }}>{t.characters}</span></>}
          {activePage === "howtoplay" && <><HelpCircle className="w-5 h-5 text-orange-400" /><span className="text-white font-bold tracking-widest text-sm uppercase" style={{ fontFamily: "'Righteous', sans-serif" }}>{t.howToPlayTitle}</span></>}
          <div className="h-px flex-grow" style={{ background: "rgba(255,107,0,0.22)" }} />
          <span className="text-white/30 text-xs">{foundIds.length}/{FIGURES.length} {t.foundLabel}</span>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="flex-grow flex flex-col">
        {activePage === "map" && (
          <>
            {/* Map (55vh on mobile, 60vh desktop) */}
            <div className="w-full flex-shrink-0" style={{ height: "clamp(280px, 55vh, 520px)" }}>
              <MapContainer center={[32.777, 34.992]} zoom={14} className="w-full h-full" zoomControl>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <MapTapHandler onTap={closeSheet} />
                {mapCenter && <MapController center={mapCenter} zoom={mapZoom} />}
                <BoundsController bounds={mapBounds} />
                {routeCoords.length > 1 && (
                  <Polyline positions={routeCoords} color="#0066FF" weight={5} opacity={0.85} dashArray="12, 6" />
                )}
                {userLocation && <Marker position={userLocation} icon={userLocIcon} />}
                {FIGURES.map((fig) => (
                  <Marker
                    key={fig.id}
                    position={getFigureLocation(fig)}
                    icon={makeFigureIcon(foundIds.includes(fig.id))}
                    eventHandlers={{ click: (e) => { e.originalEvent.stopPropagation(); openFigure(fig); } }}
                  />
                ))}
              </MapContainer>
            </div>

            {/* Figure list below map */}
            <div className="flex-grow p-5 md:p-8" style={{ background: "rgba(6,6,18,0.98)" }}>
              <h2 className="text-white mb-5 flex items-center gap-3" style={{ fontFamily: "'Righteous', sans-serif", fontSize: "1.5rem", letterSpacing: "0.05em" }}>
                <MapPin className="text-orange-400 w-6 h-6" />
                {t.theTargets}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                {FIGURES.map((fig, idx) => {
                  const isFound = foundIds.includes(fig.id);
                  const color = CARD_COLORS[idx % CARD_COLORS.length];
                  return (
                    <button
                      key={fig.id}
                      onClick={() => { openFigure(fig); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className="w-full text-left relative overflow-hidden rounded-3xl p-4 transition-all duration-200 active:scale-[0.97]"
                      style={{
                        background: "rgba(12,12,26,0.95)",
                        border: `2px solid ${isFound ? "#39FF14" : color}44`,
                        boxShadow: isFound ? `0 0 18px ${color}18` : `0 4px 16px rgba(0,0,0,0.4)`,
                      }}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl" style={{ background: isFound ? "#39FF14" : color }} />
                      <div className="flex items-start gap-3 ml-2">
                        <FigureSVG found={isFound} size={44} />
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start mb-1 gap-2">
                            <h3 className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "'Righteous', sans-serif" }}>{fig.name}</h3>
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1"
                              style={isFound ? { background: "rgba(57,255,20,0.15)", color: "#39FF14", border: "1px solid rgba(57,255,20,0.3)" } : { background: `${color}18`, color, border: `1px solid ${color}35` }}
                            >
                              {isFound && <Check className="w-2.5 h-2.5" />}
                              {isFound ? t.foundLabel : t.hiddenLabel}
                            </span>
                          </div>
                          <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{fig.hint}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-center pt-4 pb-12">
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 text-xs font-bold px-5 py-2 rounded-xl"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t.resetProgress}
                </button>
              </div>
            </div>
          </>
        )}

        {activePage === "characters" && (
          <div style={{ background: "rgba(6,6,18,0.98)", minHeight: "100%" }}>
            <CharactersView foundIds={foundIds} onSelect={openFigure} />
          </div>
        )}
        {activePage === "howtoplay" && (
          <div style={{ background: "rgba(6,6,18,0.98)", minHeight: "100%" }}>
            <HowToPlayView />
          </div>
        )}
      </div>

      {/* ── BOTTOM SHEET — suppressClose when camera is open ── */}
      <FigureSheet
        figure={selectedFigure}
        isFound={selectedFigure ? foundIds.includes(selectedFigure.id) : false}
        onClose={closeSheet}
        onFoundIt={handleFoundIt}
        onNavigate={handleNavigate}
        navInfo={navInfo}
        suppressClose={cameraOpen}
      />

      {/* ── CAMERA MODAL ── */}
      <CameraModal
        open={cameraOpen}
        figure={cameraFigure}
        onClose={() => setCameraOpen(false)}
        onSuccess={handleFoundSuccess}
      />

      {/* ── CELEBRATION ── */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
            style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)" }}
          >
            <motion.div
              initial={{ y: 80, scale: 0.3, rotate: -25 }}
              animate={{ y: 0, scale: 1, rotate: [-25, 15, -8, 3, 0] }}
              transition={{ type: "spring", damping: 9, stiffness: 80 }}
              className="flex flex-col items-center justify-center rounded-full aspect-square"
              style={{
                padding: "3.5rem",
                background: "linear-gradient(135deg, #39FF14 0%, #00cc00 100%)",
                boxShadow: "0 0 120px #39FF14, 0 0 60px #39FF14",
              }}
            >
              <span className="text-black uppercase leading-none tracking-widest text-center" style={{ fontFamily: "'Righteous', sans-serif", fontSize: "clamp(2.5rem, 12vw, 5.5rem)" }}>
                {t.foundIt.replace("!", "")}<br />It!
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
