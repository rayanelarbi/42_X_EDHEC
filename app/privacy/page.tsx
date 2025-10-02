import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour à l'accueil
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Politique de confidentialité</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <h2>Traitement local des données</h2>
            <p>
              PolarChoice est conçu avec votre vie privée comme priorité absolue. Toutes
              les données que vous fournissez (réponses au questionnaire et photo) sont
              traitées exclusivement sur votre appareil.
            </p>

            <h2>Aucune transmission externe</h2>
            <p>
              Aucune de vos informations personnelles n'est envoyée à des serveurs
              externes. Votre photo et vos réponses restent dans votre navigateur et ne
              quittent jamais votre appareil.
            </p>

            <h2>Stockage local</h2>
            <p>
              Les données sont stockées dans le localStorage de votre navigateur
              uniquement pour vous permettre de naviguer entre les pages. Vous pouvez
              supprimer ces données à tout moment en cliquant sur "Supprimer mes données"
              dans la page de résultats, ou en effaçant les données de votre navigateur.
            </p>

            <h2>Pas de cookies tiers</h2>
            <p>
              Cette application n'utilise aucun cookie tiers, aucun outil d'analytics, et
              n'intègre aucun service de tracking.
            </p>

            <h2>Simulation illustrative</h2>
            <p>
              La simulation avant/après est générée localement à l'aide de filtres
              graphiques simples appliqués via l'API Canvas de votre navigateur. Il ne
              s'agit pas d'un diagnostic médical et les résultats présentés sont purement
              illustratifs.
            </p>

            <h2>Vos droits</h2>
            <p>
              Vous avez un contrôle total sur vos données. À tout moment, vous pouvez
              supprimer toutes les informations stockées localement. Aucune donnée n'est
              conservée par PolarChoice au-delà de votre session locale.
            </p>

            <h2>Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité,
              n'hésitez pas à nous contacter à privacy@polarchoice.example.com
            </p>

            <p className="text-sm text-muted-foreground mt-8">
              Dernière mise à jour : Octobre 2025
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}