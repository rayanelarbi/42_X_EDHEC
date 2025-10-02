import CameraCapture from "@/components/CameraCapture";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CameraPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link
          href="/quiz"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour au questionnaire
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Capture photo</h1>
          <p className="text-slate-600">
            Prenez une photo de votre visage pour obtenir une simulation personnalisée.
            Votre image reste sur votre appareil.
          </p>
        </div>

        <CameraCapture />
      </div>
    </div>
  );
}