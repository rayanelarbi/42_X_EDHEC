"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { Camera, Upload, CheckCircle2, X, Sparkles, Shield } from "lucide-react";
import { translations } from "@/lib/translations";

export default function CameraCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState(false);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const setPhoto = useAppStore((state) => state.setPhoto);
  const photoBase64 = useAppStore((state) => state.photoBase64);
  const router = useRouter();

  const t = translations["en"].camera;

  const startCamera = async () => {
    if (!consent) {
      setError(t.consentError);
      return;
    }

    setError("");
    setShowVideo(true);

    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
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
    setCaptured(true);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!consent) {
      setError(t.consentUploadError);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPhoto(dataUrl);
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
    router.push("/result");
  };

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Enhanced Header with Progress */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center px-3 py-1.5 bg-blue-100 rounded-full">
                <Camera className="w-4 h-4 text-[#0065B7] mr-1.5" />
                <span className="text-xs font-semibold text-[#0065B7]">
                  Step 2/3
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{t.captureTitle}</h1>
            </div>
            {!captured && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="font-medium">100% private</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Enhanced Consent Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-md">
          <label className="flex items-start space-x-4 cursor-pointer group">
            <div className="relative mt-1 flex-shrink-0">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="w-6 h-6 rounded-lg border-2 border-gray-300 text-[#0065B7] focus:ring-2 focus:ring-[#0065B7] cursor-pointer transition-all"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-[#0065B7] rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-bold text-gray-900">{t.consent}</span>
                <span className="text-xs text-green-700 font-semibold bg-green-100 px-3 py-1 rounded-full border border-green-300">
                  100% local
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {t.consentText}
              </p>
            </div>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4">
            <div className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {!captured && !showVideo && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Camera Option - Professional */}
            <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-2xl p-8 border-2 border-blue-200 hover:border-[#0065B7] hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                  <Camera className="w-12 h-12 text-[#0065B7]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    📸 Camera
                  </h3>
                  <p className="text-sm text-gray-600">
                    Take a live photo
                  </p>
                </div>
                <Button
                  onClick={startCamera}
                  disabled={!consent}
                  className="w-full bg-gradient-to-r from-[#0065B7] to-[#0088cc] hover:from-[#004a8a] hover:to-[#006699] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                  size="lg"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  {t.startCamera}
                </Button>
              </div>
            </div>

            {/* Upload Option - Professional */}
            <div className="bg-gradient-to-br from-purple-50 via-purple-50 to-pink-100 rounded-2xl p-8 border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                  <Upload className="w-12 h-12 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    🖼️ Gallery
                  </h3>
                  <p className="text-sm text-gray-600">
                    Choose an existing photo
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={!consent}
                />
                <Button
                  type="button"
                  disabled={!consent}
                  className="w-full bg-white border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:cursor-not-allowed text-gray-900 font-bold py-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                  size="lg"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  {t.upload}
                </Button>
              </div>
            </div>
          </div>
        )}

        {!captured && showVideo && (
          <div className="space-y-5">
            <div className="relative rounded-2xl overflow-hidden border-4 border-[#0065B7] shadow-2xl bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full"
                style={{ maxHeight: "600px" }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="text-white text-center text-base font-semibold">
                  📸 Position your face in the center
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={stopCamera}
                variant="outline"
                size="lg"
                className="flex-1 border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600 py-6 rounded-xl font-semibold transition-all"
              >
                <X className="mr-2 h-5 w-5" />
                {t.cancel}
              </Button>
              <Button
                onClick={capturePhoto}
                className="flex-1 bg-gradient-to-r from-[#0065B7] to-[#0088cc] hover:from-[#004a8a] hover:to-[#006699] text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                <Camera className="mr-2 h-6 w-6" />
                {t.capture}
              </Button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {captured && photoBase64 && (
          <div className="space-y-6">
            {/* Success Message - Professional */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{t.photoCaptured}</h3>
                  <p className="text-sm text-gray-600">Your photo is ready!</p>
                </div>
              </div>
            </div>

            {/* Photo Preview - Professional */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-green-200 overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="relative">
                <img
                  src={photoBase64}
                  alt="Photo capturée"
                  className="w-full"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg border-2 border-white">
                    <Sparkles className="w-4 h-4" />
                    ✓ Validated
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-b from-white to-gray-50 flex gap-4">
                <Button
                  onClick={() => {
                    setCaptured(false);
                    setPhoto(null);
                  }}
                  variant="outline"
                  className="flex-1 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 py-6 rounded-xl font-bold transition-all"
                  size="lg"
                >
                  <X className="mr-2 h-5 w-5" />
                  {t.retake}
                </Button>
                <Button
                  onClick={proceedToResults}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                  size="lg"
                >
                  <span>{t.viewResults}</span>
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
