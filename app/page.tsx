import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClipboardList, Camera, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            PolarChoice
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Découvrez votre routine skincare personnalisée en quelques étapes simples.
            Traitement 100% local, sans transmission de données.
          </p>
          <Link href="/quiz">
            <Button size="lg" className="text-lg px-8 py-6">
              Commencer mon diagnostic
            </Button>
          </Link>
        </div>

        {/* Process cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <ClipboardList className="h-12 w-12 text-primary mb-4" />
              <CardTitle>1. Questionnaire</CardTitle>
              <CardDescription>
                Répondez à 10 questions sur votre type de peau et vos préoccupations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Camera className="h-12 w-12 text-primary mb-4" />
              <CardTitle>2. Photo</CardTitle>
              <CardDescription>
                Capturez une photo de votre visage (traitement local uniquement)
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <CardTitle>3. Routine personnalisée</CardTitle>
              <CardDescription>
                Recevez votre routine sur-mesure avec simulation avant/après
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Trust section */}
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Confidentialité garantie</h3>
            <p className="text-sm text-slate-600">
              Toutes les données sont traitées localement sur votre appareil. Aucune
              photo ni information personnelle n'est transmise à des serveurs externes.
            </p>
            <Link href="/privacy" className="text-sm text-primary hover:underline mt-2 inline-block">
              En savoir plus sur notre politique de confidentialité →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}