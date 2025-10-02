import QuizForm from "@/components/QuizForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Votre diagnostic personnalisé</h1>
          <p className="text-slate-600">
            Répondez à ces questions pour que nous puissions vous proposer la routine
            la plus adaptée à vos besoins.
          </p>
        </div>

        <QuizForm />
      </div>
    </div>
  );
}