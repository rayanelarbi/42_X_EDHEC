"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { Camera, Upload, CheckCircle2, X, Sparkles, Shield, Smartphone } from "lucide-react";
import { translations } from "@/lib/translations";

// Import Capacitor Camera (native mobile)
let CapacitorCamera: any = null;
if (typeof window !== "undefined") {
  import("@capacitor/camera").then((module) => {
    CapacitorCamera = module.Camera;
  });
}

export default function CameraCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState(false);
  const [error, setError] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const setPhoto = useAppStore((state) => state.setPhoto);
  const photoBase64 = useAppStore((state) => state.photoBase64);
  const photoConsent = useAppStore((state) => state.photoConsent);
  const setPhotoConsent = useAppStore((state) => state.setPhotoConsent);
  const addPhotoToHistory = useAppStore((state) => state.addPhotoToHistory);
  const router = useRouter();

  const t = translations["en"].camera;

  // Détecte si on est sur mobile
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  // Check consent before taking photo
  const handleTakePhoto = () => {
    if (!photoConsent) {
      setShowConsentModal(true);
    } else {
      if (isMobile()) {
        takePictureNative();
      } else {
        startCamera();
      }
    }
  };

  const handleConsentAccept = () => {
    setPhotoConsent(true);
    setShowConsentModal(false);
    if (isMobile()) {
      takePictureNative();
    } else {
      startCamera();
    }
  };

  // Utilise la caméra native mobile (Capacitor)
  const takePictureNative = async () => {
    setError("");

    if (!CapacitorCamera) {
      setError("Camera plugin not loaded yet, please try again");
      return;
    }

    try {
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: "base64",
        source: "camera", // Force caméra (pas galerie)
      });

      if (image.base64String) {
        const base64 = `data:image/${image.format};base64,${image.base64String}`;
        setPhoto(base64);
        // NE PAS ajouter à l'historique ici - sera ajouté quand on clique "Use Photo"
        setCaptured(true);
        console.log("📸 Photo prise avec succès (native camera)");
      }
    } catch (err: any) {
      console.error("Erreur caméra native:", err);
      setError("Unable to access camera: " + err.message);
    }
  };

  const startCamera = async () => {
    setError("");
    setShowVideo(true);

    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setStream(mediaStream);
    } catch (err: any) {
      console.error("Erreur caméra:", err);
      setError(`${t.cameraError}: ${err.message}`);
      setShowVideo(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowVideo(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

    setPhoto(dataUrl);
    // NE PAS ajouter à l'historique ici - sera ajouté quand on clique "Use Photo"
    setCaptured(true);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!photoConsent) {
      setShowConsentModal(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPhoto(dataUrl);
      // NE PAS ajouter à l'historique ici - sera ajouté quand on clique "Use Photo"
      setCaptured(true);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const proceedToResults = () => {
    if (!photoBase64) {
      setError(t.photoRequired);
      return;
    }
    // La photo sera automatiquement ajoutée à l'historique quand l'analyse sera terminée
    router.push("/result");
  };

  // Auto-start camera on page load if consent is given
  useEffect(() => {
    if (photoConsent && !captured && !showVideo && !stream) {
      if (isMobile()) {
        // On mobile, don't auto-start native camera (user needs to tap)
        // Native camera API requires user interaction
      } else {
        // On desktop, auto-start webcam
        startCamera();
      }
    }
  }, [photoConsent]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (stream && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream, showVideo]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-black md:bg-black flex flex-col items-center justify-center md:p-8">
      {/* Full screen iOS-style camera for mobile, card for desktop */}

      {!captured && !showVideo && (
        /* Mode initial - Camera/Gallery choice */
        <div className="h-full md:h-auto md:max-w-2xl md:w-full md:bg-gray-900 md:rounded-3xl md:shadow-2xl flex flex-col justify-end md:justify-center pb-safe md:pb-0">
          {/* Top area - Instructions */}
          <div className="flex-1 md:flex-none flex items-center justify-center px-6 md:py-12">
            <div className="text-center">
              <Camera className="w-20 h-20 text-white mx-auto mb-4 opacity-60" />
              <h2 className="text-2xl font-semibold text-white mb-3">
                Take a photo
              </h2>
              <p className="text-gray-300 text-base">
                Position your face in good lighting
              </p>
            </div>
          </div>

          {/* Bottom controls - iOS style */}
          <div className="px-6 pb-safe">
            <div className="flex items-center justify-center gap-8 mb-4">
              {/* Gallery preview button */}
              <button
                onClick={() => document.getElementById("file-upload")?.click()}
                className="w-12 h-12 rounded-lg border-2 border-white/50 flex items-center justify-center hover:border-white transition-all"
              >
                <Upload className="w-6 h-6 text-white" />
              </button>

              {/* Large round capture button - iOS style */}
              <button
                onClick={handleTakePhoto}
                className="w-20 h-20 rounded-full bg-white border-4 border-gray-800 hover:bg-gray-100 transition-transform active:scale-95 shadow-2xl"
              />

              {/* Spacer for symmetry */}
              <div className="w-12 h-12" />
            </div>

            <p className="text-center text-xs text-gray-400">
              Tap the button to capture
            </p>
          </div>

          {/* Hidden file input */}
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {!captured && showVideo && (
        /* Full-screen video for mobile, card format for desktop */
        <div className="h-full md:h-auto md:max-w-4xl md:w-full md:max-h-[70vh] md:mx-auto flex flex-col md:bg-gray-900 md:rounded-3xl md:shadow-2xl md:overflow-hidden">
          {/* Video preview with better desktop layout */}
          <div className="flex-1 md:flex-none relative min-h-0 md:h-auto md:max-h-[50vh] md:bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover md:w-auto md:h-full md:max-w-full md:object-contain md:mx-auto md:block"
            />

            {/* Top close button */}
            <button
              onClick={stopCamera}
              className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Instruction overlay - only on mobile */}
            <div className="md:hidden absolute bottom-4 left-0 right-0 px-6 z-10">
              <div className="bg-black/40 backdrop-blur-md rounded-2xl px-6 py-3">
                <p className="text-white text-center font-medium text-sm">
                  Position your face in the center
                </p>
              </div>
            </div>
          </div>

          {/* Bottom capture button - Always visible on desktop */}
          <div className="pt-6 px-6 pb-safe md:pb-32 bg-black md:bg-gray-900 flex-shrink-0">
            {/* Desktop instruction */}
            <p className="hidden md:block text-center text-sm text-gray-300 mb-4">
              Position your face in the center and click to capture
            </p>

            <div className="flex items-center justify-center gap-8 mb-4">
              {/* Spacer */}
              <div className="w-12 h-12" />

              {/* Large round capture button */}
              <button
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full bg-white border-4 border-gray-800 hover:bg-gray-100 transition-transform active:scale-95 shadow-2xl"
              />

              {/* Spacer */}
              <div className="w-12 h-12" />
            </div>
            <p className="md:hidden text-center text-xs text-gray-400">
              Click to capture
            </p>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {captured && photoBase64 && (
        /* Full-screen preview for mobile, card for desktop */
        <div className="h-full md:h-auto md:max-w-4xl md:w-full md:max-h-[70vh] md:mx-auto flex flex-col bg-black md:bg-gray-900 md:rounded-3xl md:shadow-2xl md:overflow-hidden">
          {/* Photo preview */}
          <div className="flex-1 md:flex-none relative min-h-0 md:h-auto md:max-h-[50vh] md:bg-black md:flex md:items-center md:justify-center">
            <img
              src={photoBase64}
              alt="Captured photo"
              className="w-full h-full object-contain md:w-auto md:h-full md:max-w-full"
            />

            {/* Success badge */}
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                <CheckCircle2 className="w-4 h-4" />
                Captured
              </div>
            </div>
          </div>

          {/* Bottom actions - Always visible */}
          <div className="pt-6 px-6 pb-safe md:pb-32 bg-black md:bg-gray-900 flex-shrink-0">
            <div className="flex items-center gap-4 mb-4">
              {/* Retake button */}
              <button
                onClick={() => {
                  setCaptured(false);
                  setPhoto(null);
                }}
                className="flex-1 py-4 rounded-2xl bg-gray-800/80 backdrop-blur-sm text-white font-semibold hover:bg-gray-700 transition-all"
              >
                Retake
              </button>

              {/* Use Photo button */}
              <button
                onClick={proceedToResults}
                className="flex-1 py-4 rounded-2xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-all shadow-lg"
              >
                Use Photo
              </button>
            </div>

            <p className="text-center text-xs text-gray-400">
              Your photo will be analyzed for skin insights
            </p>
          </div>
        </div>
      )}

      {/* Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-[#0065B7]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t.consent}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {t.consentText}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-semibold text-green-700">
                    100% local - No data sent to servers
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowConsentModal(false)}
                variant="outline"
                className="flex-1 border-2 border-gray-300 hover:border-gray-400"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConsentAccept}
                className="flex-1 bg-[#0065B7] hover:bg-[#004a8a]"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                I Agree
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              You can change this in Settings later
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
