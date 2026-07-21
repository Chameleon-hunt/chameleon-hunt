import { useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FIGURES, Figure, getFigureLocation } from "./lib/figures";
import { CameraModal } from "./components/CameraModal";
import { FigureSheet, NavInfo, FigureSVG } from "./components/FigureSheet";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Target, RefreshCw, Check, Map, Users, HelpCircle, Home,
  Trophy, ArrowLeft
} from "lucide-react";
import { LogoMark } from "./Home";
import type { Page } from "./App";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

// ──────────────────────────────────────────────
// Custom Leaflet icons
// ──────────────────────────────────────────────
function makeFigureIcon(found: boolean) {
  const eyeColor = found ? "#00aa00" : "#111111";
  const fillColor = found ? "#dfffdf" : "#ffffff";
  const glowFilter = found
    ? 'filter:drop-shadow(0 0 10px #39FF14) drop-shadow(0 0 4px #39FF14);'
    : 'filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));';

  const pulseDot = !found
    ? `<div style="position:absolute;top:-4px;right:-6px;width:13px;height:13px;background:#FF6B00;border-radius:50%;border:2px solid white;animation:markerPulse 1.5s infinite;"></div>`
    : "";

  const svg = `<svg viewBox="0 0 40 58" width="38" height="56" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="14" r="13" fill="${fillColor}" stroke="${found ? "#00cc00" : "#ccc"}" stroke-width="0.5"/>
    <rect x="11" y="9" width="5" height="7" rx="1" fill="${eyeColor}"/>
    <rect x="24" y="9" width="5" height="7" rx="1" fill="${eyeColor}"/>
    <rect x="10" y="18" width="2.5" height="2.5" fill="${eyeColor}"/>
    <rect x="27.5" y="18" width="2.5" height="2.5" fill="${eyeColor}"/>
    <rect x="12" y="20.5" width="16" height="3" rx="0.5" fill="${eyeColor}"/>
    <ellipse cx="20" cy="44" rx="15" ry="16" fill="${fillColor}" stroke="${found ? "#00cc00" : "#ccc"}" stroke-width="0.5"/>
  </svg>`;

  return L.divIcon({
    className: "",
    html: `<div style="position:relative;${glowFilter}">${svg}${pulseDot}</div>`,
    iconSize: [38, 56],
    iconAnchor: [19, 56],
    popupAnchor: [0, -58],
  });
}

const userLocIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;background:#0080FF;border-radius:50%;border:3px solid white;box-shadow:0 0 0 5px rgba(0,128,255,0.25),0 2px 8px rgba(0,0,0,0.4);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// ──────────────────────────────────────────────
// Map helpers
// ──────────────────────────────────────────────
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

// ──────────────────────────────────────────────
// Card colours
// ──────────────────────────────────────────────
const CARD_COLORS = [
  "#FF2D55", "#FF6B00", "#FFE600", "#39FF14", "#0080FF",
  "#9B59B6", "#FF2D55", "#FF6B00", "#FFE600",
];

// ──────────────────────────────────────────────
// Sub-views
// ──────────────────────────────────────────────
function CharactersView({ foundIds, onSelect }: { foundIds: number[]; onSelect: (f: Figure) => void }) {
  return (
    <div className="flex-grow p-6 md:p-10">
      <h2
        className="text-white mb-8 flex items-center gap-3"
        style={{ fontFamily: "'Righteous', sans-serif", fontSize: "1.8rem", letterSpacing: "0.06em" }}
      >
        <Users className="text-orange-400 w-7 h-7" />
        Characters
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-12">
        {FIGURES.map((fig, idx) => {
          const isFound = foundIds.includes(fig.id);
          const color = CARD_COLORS[idx % CARD_COLORS.length];
          return (
            <button
              key={fig.id}
              onClick={() => onSelect(fig)}
              className="w-full text-left relative overflow-hidden rounded-3xl p-5 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: "rgba(12,12,24,0.92)",
                border: `3px solid ${isFound ? "#39FF14" : color}55`,
                boxShadow: isFound
                  ? `0 0 24px ${color}25, 0 4px 20px rgba(0,0,0,0.5)`
                  : `0 4px 20px rgba(0,0,0,0.4)`,
              }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl" style={{ background: isFound ? "#39FF14" : color }} />
              <div className="flex items-start gap-3 ml-2">
                <div className="flex-shrink-0 mt-0.5">
                  <FigureSVG found={isFound} size={44} />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: "'Righteous', sans-serif" }}>
                      {fig.name}
                    </h3>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 flex items-center gap-1"
                      style={
                        isFound
                          ? { background: "rgba(57,255,20,0.15)", color: "#39FF14", border: "1px solid rgba(57,255,20,0.35)" }
                          : { background: `${color}18`, color, border: `1px solid ${color}40` }
                      }
                    >
                      {isFound && <Check className="w-3 h-3 stroke-[2.5]" />}
                      {isFound ? "FOUND" : "HIDDEN"}
                    </span>
                  </div>
                  <p className="text-sm leading-snug" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {fig.hint}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HowToPlayView() {
  const steps = [
    { n: "01", color: "#FF2D55", title: "Explore the map", body: "Open the map and find the white chameleon markers scattered around the city." },
    { n: "02", color: "#FFE600", title: "Head to the location", body: "Follow the walking directions to navigate to the figure's real-world hiding spot." },
    { n: "03", color: "#39FF14", title: "Find the figure", body: "Look around carefully — the hand-painted figure is hidden somewhere nearby." },
    { n: "04", color: "#0080FF", title: "Snap a photo", body: "Tap 'Found It!', take a photo as proof, and submit. The figure is now yours to keep!" },
  ];
  return (
    <div className="flex-grow p-6 md:p-10">
      <h2
        className="text-white mb-8 flex items-center gap-3"
        style={{ fontFamily: "'Righteous', sans-serif", fontSize: "1.8rem", letterSpacing: "0.06em" }}
      >
        <HelpCircle className="text-orange-400 w-7 h-7" />
        How To Play
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12 max-w-3xl">
        {steps.map(({ n, color, title, body }) => (
          <div
            key={n}
            className="rounded-3xl p-6"
            style={{ background: "rgba(12,12,24,0.92)", border: `2px solid ${color}44` }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg mb-4"
              style={{ background: `${color}22`, color, fontFamily: "'Righteous', sans-serif", border: `2px solid ${color}55` }}
            >
              {n}
            </div>
            <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "'Righteous', sans-serif" }}>{title}</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{body}</p>
          </div>
        ))}
      </div>
      <div
        className="rounded-3xl p-6 max-w-3xl"
        style={{ background: "rgba(57,255,20,0.07)", border: "2px solid rgba(57,255,20,0.25)" }}
      >
        <p className="text-white font-bold text-xl mb-1" style={{ fontFamily: "'Righteous', sans-serif" }}>
          Found it? Keep it! 🎉
        </p>
        <p style={{ color: "rgba(255,255,255,0.6)" }}>
          Each figure is a hand-painted collectible from the Mecha Chameleon board game. If you find it, it's yours!
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Shared inner nav (used on map/characters/howtoplay pages)
// ──────────────────────────────────────────────
const INNER_TABS: Array<{ page: Page; label: string; icon: React.ReactNode }> = [
  { page: "map",        label: "MAP",        icon: <Map className="w-4 h-4" /> },
  { page: "characters", label: "CHARACTERS", icon: <Users className="w-4 h-4" /> },
  { page: "howtoplay",  label: "HOW TO PLAY",icon: <HelpCircle className="w-4 h-4" /> },
];

// ──────────────────────────────────────────────
// Main Game component
// ──────────────────────────────────────────────
export function Game({ activePage, onNavigate }: { activePage: Page; onNavigate: (page: Page) => void }) {
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
    // Jump to map view if on another tab
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
            const res = await fetch(
              `https://router.project-osrm.org/route/v1/walking/${uLng},${uLat};${fLng},${fLat}?overview=full&geometries=geojson`
            );
            const data = await res.json();
            if (!data.routes?.length) { resolve(null); return; }
            const route = data.routes[0];
            const coords: [number, number][] = route.geometry.coordinates.map(
              ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
            );
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
    if (window.confirm("Reset your progress? This cannot be undone.")) {
      setFoundIds([]);
      localStorage.removeItem("chameleon_hunt_found");
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col overflow-x-hidden" style={{ background: "#06060f" }}>

      {/* ── TOP NAVBAR ── */}
      <nav
        className="relative z-30 flex items-center justify-between px-4 py-2.5 flex-shrink-0"
        style={{
          background: "rgba(6,6,16,0.96)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Back + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <button onClick={() => onNavigate("home")}>
            <LogoMark size="sm" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1">
          {INNER_TABS.map(({ page, label, icon }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                fontFamily: "'Righteous', sans-serif",
                background: activePage === page ? "rgba(255,107,0,0.2)" : "transparent",
                color: activePage === page ? "#FF6B00" : "rgba(255,255,255,0.5)",
                border: activePage === page ? "1px solid rgba(255,107,0,0.4)" : "1px solid transparent",
                letterSpacing: "0.05em",
              }}
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Score */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.25)" }}
        >
          <Target className="w-4 h-4 text-orange-400" />
          <span className="text-white font-bold text-sm">{foundIds.length}/{FIGURES.length}</span>
        </div>
      </nav>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-grow flex flex-col relative z-0">

        {/* ── MAP VIEW ── */}
        {activePage === "map" && (
          <div className="flex-grow flex flex-col">
            {/* Map */}
            <div className="w-full relative flex-shrink-0" style={{ height: "60vh" }}>
              <MapContainer
                center={[32.777, 34.992]}
                zoom={15}
                className="w-full h-full"
                zoomControl
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
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
                    eventHandlers={{
                      click: (e) => { e.originalEvent.stopPropagation(); openFigure(fig); },
                    }}
                  />
                ))}
              </MapContainer>
            </div>

            {/* Figure list below map */}
            <div className="flex-grow p-6 md:p-10" style={{ background: "rgba(4,4,14,0.98)" }}>
              <h2
                className="text-white mb-8 flex items-center gap-3"
                style={{ fontFamily: "'Righteous', sans-serif", fontSize: "1.8rem", letterSpacing: "0.06em" }}
              >
                <MapPin className="text-orange-400 w-7 h-7" />
                The Targets
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-12">
                {FIGURES.map((fig, idx) => {
                  const isFound = foundIds.includes(fig.id);
                  const color = CARD_COLORS[idx % CARD_COLORS.length];
                  return (
                    <button
                      key={fig.id}
                      onClick={() => { openFigure(fig); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className="w-full text-left relative overflow-hidden rounded-3xl p-5 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                      style={{
                        background: "rgba(12,12,24,0.92)",
                        border: `3px solid ${isFound ? "#39FF14" : color}55`,
                        boxShadow: isFound ? `0 0 24px ${color}25, 0 4px 20px rgba(0,0,0,0.5)` : `0 4px 20px rgba(0,0,0,0.4)`,
                      }}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl" style={{ background: isFound ? "#39FF14" : color }} />
                      <div className="flex items-start gap-3 ml-2">
                        <div className="flex-shrink-0 mt-0.5"><FigureSVG found={isFound} size={44} /></div>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <h3 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: "'Righteous', sans-serif" }}>{fig.name}</h3>
                            <span
                              className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 flex items-center gap-1"
                              style={
                                isFound
                                  ? { background: "rgba(57,255,20,0.15)", color: "#39FF14", border: "1px solid rgba(57,255,20,0.35)" }
                                  : { background: `${color}18`, color, border: `1px solid ${color}40` }
                              }
                            >
                              {isFound && <Check className="w-3 h-3 stroke-[2.5]" />}
                              {isFound ? "FOUND" : "HIDDEN"}
                            </span>
                          </div>
                          <p className="text-sm leading-snug" style={{ color: "rgba(255,255,255,0.55)" }}>{fig.hint}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-center mt-4 pb-12">
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 text-sm font-bold px-6 py-2 rounded-xl transition-colors"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Progress
                </button>
              </div>
            </div>
          </div>
        )}

        {activePage === "characters" && (
          <CharactersView foundIds={foundIds} onSelect={(fig) => { openFigure(fig); }} />
        )}
        {activePage === "howtoplay" && <HowToPlayView />}
      </div>

      {/* ── BOTTOM SHEET ── */}
      <FigureSheet
        figure={selectedFigure}
        isFound={selectedFigure ? foundIds.includes(selectedFigure.id) : false}
        onClose={closeSheet}
        onFoundIt={handleFoundIt}
        onNavigate={handleNavigate}
        navInfo={navInfo}
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
              className="relative flex flex-col items-center justify-center rounded-full aspect-square"
              style={{
                padding: "3.5rem",
                background: "linear-gradient(135deg, #39FF14 0%, #00cc00 100%)",
                boxShadow: "0 0 120px #39FF14, 0 0 60px #39FF14, 0 0 30px #39FF14",
              }}
            >
              <span
                className="text-black uppercase leading-none tracking-widest text-center"
                style={{ fontFamily: "'Righteous', sans-serif", fontSize: "clamp(3rem, 14vw, 6rem)" }}
              >
                Found<br />It!
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
