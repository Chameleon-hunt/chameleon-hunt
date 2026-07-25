import { useState, useRef, useEffect } from "react";
import { Figure } from "../lib/figures";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Camera, X, RotateCcw } from "lucide-react";

export function CameraModal({
  figure,
  open,
  onClose,
  onSuccess,
}: {
  figure: Figure | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (id: number) => void;
}) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fallbackName, setFallbackName] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    if (open) {
      setCameraError(false);
      setPhotoBlob(null);
      setSubmitError(null);
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      setPhotoUrl(null);
      setFallbackName("");

      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((s) => {
          activeStream = s;
          setStream(s);
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(() => setCameraError(true));
    }

    return () => {
      if (activeStream) activeStream.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setPhotoBlob(blob);
        setPhotoUrl(URL.createObjectURL(blob));
        stream?.getTracks().forEach((t) => t.stop());
        setStream(null);
      },
      "image/jpeg",
      0.82
    );
  };

  const retake = () => {
    setPhotoBlob(null);
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(null);
    setCameraError(false);
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setCameraError(true));
  };

  const submitReport = async () => {
    if (!figure) return;
    setSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.append("figure", figure.name);
    formData.append("location", figure.hint);
    formData.append("_subject", `CHAMELEON HUNT — ${figure.name} Found!`);
    if (photoBlob) formData.append("photo", photoBlob, "photo.jpg");
    if (fallbackName.trim()) formData.append("finder_name", fallbackName.trim());

    try {
      const response = await fetch("https://formspree.io/f/xjgnoabr", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        let msg = `Submission failed (${response.status})`;
        try {
          const err = await response.json();
          if (err.error) msg = err.error;
        } catch { /* ignore */ }
        throw new Error(msg);
      }

      onSuccess(figure.id);
    } catch (e: any) {
      setSubmitError(e.message ?? "Failed to submit. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit =
    !submitting && (photoBlob !== null || (cameraError && fallbackName.trim().length > 0));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="camera-overlay"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed inset-0 flex flex-col"
          style={{
            zIndex: 2000,
            background: "linear-gradient(180deg, #060614 0%, #0a0a1a 100%)",
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          {/* ── Top bar ── */}
          <div
            className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(255,107,0,0.2)" }}
          >
            <div>
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(255,107,0,0.8)", fontFamily: "'Righteous', sans-serif" }}>
                🎯 FOUND IT!
              </p>
              <h2
                className="text-white text-xl font-black leading-tight"
                style={{ fontFamily: "'Righteous', sans-serif" }}
              >
                {figure?.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={submitting}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Camera / photo area (full remaining height) ── */}
          <div className="flex-1 flex flex-col px-4 pt-4 pb-4 gap-4 overflow-y-auto">
            {!cameraError ? (
              <div
                className="relative overflow-hidden flex items-center justify-center flex-1"
                style={{
                  background: "#000",
                  borderRadius: 20,
                  minHeight: 240,
                  border: "2px solid rgba(255,107,0,0.25)",
                }}
              >
                {!photoBlob ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ borderRadius: 18 }}
                    />
                    {/* Viewfinder corners */}
                    {['top-3 left-3','top-3 right-3','bottom-3 left-3','bottom-3 right-3'].map((pos, i) => (
                      <div
                        key={i}
                        className={`absolute ${pos} w-8 h-8`}
                        style={{
                          borderTop: i < 2 ? '3px solid rgba(255,107,0,0.7)' : 'none',
                          borderBottom: i >= 2 ? '3px solid rgba(255,107,0,0.7)' : 'none',
                          borderLeft: i % 2 === 0 ? '3px solid rgba(255,107,0,0.7)' : 'none',
                          borderRight: i % 2 === 1 ? '3px solid rgba(255,107,0,0.7)' : 'none',
                          borderRadius: i === 0 ? '6px 0 0 0' : i === 1 ? '0 6px 0 0' : i === 2 ? '0 0 0 6px' : '0 0 6px 0',
                        }}
                      />
                    ))}
                    {/* Shutter button */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                      <button
                        onClick={capturePhoto}
                        className="w-20 h-20 rounded-full active:scale-90 transition-transform flex items-center justify-center"
                        style={{
                          background: "white",
                          border: "6px solid rgba(200,200,200,0.8)",
                          boxShadow: "0 0 30px rgba(255,255,255,0.6), 0 0 0 3px rgba(255,107,0,0.5)",
                        }}
                        aria-label="Take photo"
                      >
                        <Camera className="w-8 h-8 text-black" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <img src={photoUrl!} className="w-full h-full object-cover" style={{ borderRadius: 18 }} alt="Captured" />
                    <button
                      onClick={retake}
                      className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm text-white"
                      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.15)" }}
                    >
                      <RotateCcw className="w-4 h-4" /> Retake
                    </button>
                  </>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            ) : (
              <div
                className="p-5 rounded-2xl space-y-3 flex-1"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <p className="text-white font-medium leading-relaxed">
                  Camera not available — no problem! Enter your name to claim your find.
                </p>
                <input
                  type="text"
                  placeholder="Your name or nickname"
                  value={fallbackName}
                  onChange={(e) => setFallbackName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white text-lg font-medium placeholder:text-zinc-500 outline-none"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "2px solid rgba(255,107,0,0.4)",
                  }}
                />
              </div>
            )}

            {/* Submit error */}
            {submitError && (
              <div
                className="rounded-xl p-3 text-sm flex-shrink-0"
                style={{ background: "rgba(255,45,85,0.15)", border: "1px solid rgba(255,45,85,0.4)", color: "#ff8099" }}
              >
                {submitError}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={onClose}
                disabled={submitting}
                className="py-4 px-6 rounded-2xl font-bold text-white transition-colors disabled:opacity-50"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", fontFamily: "'Righteous', sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={submitReport}
                disabled={!canSubmit}
                className="flex-1 py-4 rounded-2xl font-bold text-black flex items-center justify-center gap-2 transition-all disabled:opacity-40 active:scale-95"
                style={{
                  fontFamily: "'Righteous', sans-serif",
                  fontSize: "1.05rem",
                  letterSpacing: "0.06em",
                  background: canSubmit
                    ? "linear-gradient(135deg, #39FF14, #00cc00)"
                    : "rgba(255,255,255,0.08)",
                  color: canSubmit ? "black" : "rgba(255,255,255,0.4)",
                  boxShadow: canSubmit ? "0 0 24px rgba(57,255,20,0.45)" : "none",
                }}
              >
                {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                {submitting ? "Sending…" : "SUBMIT FIND! 🎉"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
