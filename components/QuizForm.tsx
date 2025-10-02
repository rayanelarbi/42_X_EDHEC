"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

const QuizSchema = z.object({
  sex: z.enum(["male", "female", "other"]),
  ageRange: z.enum(["18-25", "26-35", "36-45", "46+"]),
  skinType: z.enum(["dry", "oily", "combination", "sensitive"]),
  mainConcern: z.enum(["acne", "pores", "redness", "texture", "wrinkles", "dullness"]),
  severity: z.number().min(1).max(5),
  sensitivities: z.array(z.string()),
  currentRoutineLevel: z.enum(["none", "basic", "intermediate", "advanced"]),
  desiredSimplicity: z.enum(["minimal", "moderate", "comprehensive"]),
  budget: z.enum(["affordable", "moderate", "premium"]),
  photoConsent: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter pour continuer",
  }),
});

type QuizFormData = z.infer<typeof QuizSchema>;

export default function QuizForm() {
  const router = useRouter();
  const setQuiz = useAppStore((state) => state.setQuiz);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuizFormData>({
    resolver: zodResolver(QuizSchema),
    defaultValues: {
      sensitivities: [],
      severity: 3,
      photoConsent: false,
    },
  });

  const onSubmit = (data: QuizFormData) => {
    setQuiz(data);
    router.push("/camera");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Questionnaire personnalisé</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sexe */}
          <div className="space-y-2">
            <Label htmlFor="sex">Sexe</Label>
            <select
              {...register("sex")}
              id="sex"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Sélectionnez</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="other">Autre</option>
            </select>
            {errors.sex && (
              <p className="text-sm text-destructive">{errors.sex.message}</p>
            )}
          </div>

          {/* Tranche d'âge */}
          <div className="space-y-2">
            <Label htmlFor="ageRange">Tranche d'âge</Label>
            <select
              {...register("ageRange")}
              id="ageRange"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Sélectionnez</option>
              <option value="18-25">18-25 ans</option>
              <option value="26-35">26-35 ans</option>
              <option value="36-45">36-45 ans</option>
              <option value="46+">46+ ans</option>
            </select>
            {errors.ageRange && (
              <p className="text-sm text-destructive">{errors.ageRange.message}</p>
            )}
          </div>

          {/* Type de peau */}
          <div className="space-y-2">
            <Label htmlFor="skinType">Type de peau</Label>
            <select
              {...register("skinType")}
              id="skinType"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Sélectionnez</option>
              <option value="dry">Sèche</option>
              <option value="oily">Grasse</option>
              <option value="combination">Mixte</option>
              <option value="sensitive">Sensible</option>
            </select>
            {errors.skinType && (
              <p className="text-sm text-destructive">{errors.skinType.message}</p>
            )}
          </div>

          {/* Problème principal */}
          <div className="space-y-2">
            <Label htmlFor="mainConcern">Préoccupation principale</Label>
            <select
              {...register("mainConcern")}
              id="mainConcern"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Sélectionnez</option>
              <option value="acne">Acné</option>
              <option value="pores">Pores dilatés</option>
              <option value="redness">Rougeurs</option>
              <option value="texture">Texture irrégulière</option>
              <option value="wrinkles">Rides</option>
              <option value="dullness">Teint terne</option>
            </select>
            {errors.mainConcern && (
              <p className="text-sm text-destructive">{errors.mainConcern.message}</p>
            )}
          </div>

          {/* Intensité */}
          <div className="space-y-2">
            <Label htmlFor="severity">Intensité (1 = léger, 5 = sévère)</Label>
            <Input
              type="number"
              id="severity"
              min={1}
              max={5}
              {...register("severity", { valueAsNumber: true })}
            />
            {errors.severity && (
              <p className="text-sm text-destructive">{errors.severity.message}</p>
            )}
          </div>

          {/* Sensibilités */}
          <div className="space-y-2">
            <Label>Sensibilités (cochez si applicable)</Label>
            <div className="space-y-2">
              {["Parfums", "Alcool", "Huiles essentielles", "Rétinol"].map((item) => (
                <label key={item} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={item}
                    {...register("sensitivities")}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Niveau routine actuel */}
          <div className="space-y-2">
            <Label htmlFor="currentRoutineLevel">Routine actuelle</Label>
            <select
              {...register("currentRoutineLevel")}
              id="currentRoutineLevel"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
              <option value="">Sélectionnez</option>
              <option value="none">Aucune routine</option>
              <option value="basic">Basique (nettoyant + hydratant)</option>
              <option value="intermediate">Intermédiaire (+ sérums)</option>
              <option value="advanced">Avancée (routine complète)</option>
            </select>
            {errors.currentRoutineLevel && (
              <p className="text-sm text-destructive">
                {errors.currentRoutineLevel.message}
              </p>
            )}
          </div>

          {/* Simplicité désirée */}
          <div className="space-y-2">
            <Label htmlFor="desiredSimplicity">Simplicité souhaitée</Label>
            <select
              {...register("desiredSimplicity")}
              id="desiredSimplicity"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
              <option value="">Sélectionnez</option>
              <option value="minimal">Minimale (3-4 étapes)</option>
              <option value="moderate">Modérée (5-6 étapes)</option>
              <option value="comprehensive">Complète (7+ étapes)</option>
            </select>
            {errors.desiredSimplicity && (
              <p className="text-sm text-destructive">
                {errors.desiredSimplicity.message}
              </p>
            )}
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <select
              {...register("budget")}
              id="budget"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Sélectionnez</option>
              <option value="affordable">Abordable ({"<"} 50€/mois)</option>
              <option value="moderate">Modéré (50-100€/mois)</option>
              <option value="premium">Premium ({">"}100€/mois)</option>
            </select>
            {errors.budget && (
              <p className="text-sm text-destructive">{errors.budget.message}</p>
            )}
          </div>

          {/* Consentement photo */}
          <div className="space-y-2">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                {...register("photoConsent")}
                className="mt-1 h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm">
                J'accepte de prendre une photo de mon visage pour obtenir une
                simulation personnalisée. Ma photo sera traitée localement et ne
                sera pas transmise à des serveurs externes.
              </span>
            </label>
            {errors.photoConsent && (
              <p className="text-sm text-destructive">
                {errors.photoConsent.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full">
        Continuer
      </Button>
    </form>
  );
}