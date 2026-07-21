import { useState, useRef, useEffect } from "react";
import { Figure } from "../lib/figures";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Camera, X } from "lucide-react";

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
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        className="sm:max-w-md p-0 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0a0a1a 0%, #0d0d22 100%)",
          border: "3px solid rgba(255,107,0,0.5)",
          borderRadius: 24,
        }}
      >
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle
            className="text-3xl text-white"
            style={{ fontFamily: "'Righteous', sans-serif", letterSpacing: "0.04em" }}
          >
            Found{" "}
            <span style={{ color: "#39FF14" }}>{figure?.name}</span>!
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 pt-4 flex flex-col gap-4">
          {/* Camera / photo area */}
          {!cameraError ? (
            <div
              className="relative overflow-hidden flex items-center justify-center"
              style={{
                background: "#000",
                borderRadius: 16,
                aspectRatio: "3/4",
                border: "2px solid rgba(255,255,255,0.1)",
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
                  />
                  <div className="absolute bottom-5 left-0 right-0 flex justify-center">
                    <button
                      onClick={capturePhoto}
                      className="w-20 h-20 rounded-full active:scale-90 transition-transform flex items-center justify-center"
                      style={{
                        background: "white",
                        border: "6px solid rgba(200,200,200,0.8)",
                        boxShadow: "0 0 30px rgba(255,255,255,0.6)",
                      }}
                      aria-label="Take photo"
                    >
                      <Camera className="w-8 h-8 text-black" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <img src={photoUrl!} className="w-full h-full object-cover" alt="Captured" />
                  <button
                    onClick={retake}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-white"
                    style={{ background: "rgba(0,0,0,0.6)" }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                    <span
                      className="text-white text-sm font-bold px-4 py-2 rounded-full"
                      style={{ background: "rgba(0,0,0,0.6)" }}
                    >
                      Tap X to retake
                    </span>
                  </div>
                </>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          ) : (
            <div
              className="p-5 rounded-2xl space-y-3"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
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
              className="rounded-xl p-3 text-sm"
              style={{ background: "rgba(255,45,85,0.15)", border: "1px solid rgba(255,45,85,0.4)", color: "#ff8099" }}
            >
              {submitError}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={submitting}
              className="py-3 px-5 rounded-xl font-bold text-white transition-colors disabled:opacity-50"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              Cancel
            </button>
            <button
              onClick={submitReport}
              disabled={!canSubmit}
              className="flex-1 py-3 rounded-xl font-bold text-black flex items-center justify-center gap-2 transition-all disabled:opacity-40 active:scale-95"
              style={{
                fontFamily: "'Righteous', sans-serif",
                fontSize: "1.1rem",
                letterSpacing: "0.05em",
                background: canSubmit
                  ? "linear-gradient(135deg, #39FF14, #00cc00)"
                  : "rgba(255,255,255,0.1)",
                color: canSubmit ? "black" : "rgba(255,255,255,0.4)",
                boxShadow: canSubmit ? "0 0 20px rgba(57,255,20,0.4)" : "none",
              }}
            >
              {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {submitting ? "Sending..." : "Submit Find!"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
