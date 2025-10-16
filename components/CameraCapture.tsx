"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { Camera, Upload, CheckCircle2 } from "lucide-react";

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

  const startCamera = async () => {
    if (!consent) {
      setError("Veuillez cocher la case de consentement pour accéder à la caméra.");
      return;
    }

    setError("");
    setShowVideo(true);

    // Attendre que le DOM soit mis à jour
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
      setError(`Impossible d'accéder à la caméra: ${err.message}`);
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
      setError("Veuillez cocher la case de consentement pour uploader une photo.");
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
      setError("Veuillez capturer ou uploader une photo avant de continuer.");
      return;
    }
    router.push("/result");
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Effet pour assigner le stream quand la vidéo est montée
  useEffect(() => {
    if (stream && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream, showVideo]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Consentement</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm">
              Je confirme que ma photo sera traitée uniquement sur mon appareil
              (traitement local) et ne sera pas envoyée à des serveurs externes. Je
              peux la supprimer à tout moment.
            </span>
          </label>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!captured && (
        <Card>
          <CardHeader>
            <CardTitle>Capturer une photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showVideo ? (
              <Button onClick={startCamera} className="w-full" size="lg">
                <Camera className="mr-2 h-5 w-5" />
                Activer la caméra
              </Button>
            ) : (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg border"
                  style={{ maxHeight: "480px", backgroundColor: "#000" }}
                />
                <div className="flex gap-2">
                  <Button onClick={capturePhoto} className="flex-1" size="lg">
                    <Camera className="mr-2 h-5 w-5" />
                    Capturer
                  </Button>
                  <Button onClick={stopCamera} variant="outline" size="lg">
                    Annuler
                  </Button>
                </div>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Ou</span>
              </div>
            </div>

            <div>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="mr-2 h-5 w-5" />
                Uploader une photo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {captured && photoBase64 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Photo capturée
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <img
              src={photoBase64}
              alt="Photo capturée"
              className="w-full rounded-lg border"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setCaptured(false);
                  setPhoto(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Reprendre
              </Button>
              <Button onClick={proceedToResults} className="flex-1" size="lg">
                Voir mes résultats
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}