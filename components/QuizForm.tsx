"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

const QuizSchema = z.object({
  sex: z.enum(["male", "female"]),
  ageRange: z.enum(["18-25", "26-35", "36-45", "46+"]),
  location: z.enum(["city", "countryside", "humid", "dry"]),
  skinType: z.enum(["dry", "normal", "combination", "oily", "sensitive"]),
  skinConcerns: z.array(z.string()),
  objectives: z.array(z.string()).max(3, "Maximum 3 objectifs"),
  dermaConditions: z.array(z.string()),
  currentRoutineLevel: z.enum(["none", "1-2", "3-4", "5+"]),
  productsUsed: z.array(z.string()),
  sunExposure: z.enum(["low", "medium", "high"]),
  stressLevel: z.enum(["low", "medium", "high"]),
  preferences: z.array(z.string()),
  budget: z.enum(["<20", "20-40", "40-60", "60+"]),
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
    formState: { errors },
  } = useForm<QuizFormData>({
    resolver: zodResolver(QuizSchema),
    defaultValues: {
      skinConcerns: [],
      objectives: [],
      dermaConditions: [],
      productsUsed: [],
      preferences: [],
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
          <CardTitle>Questionnaire personnalisé Paula's Choice</CardTitle>
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
            </select>
            {errors.sex && (
              <p className="text-sm text-destructive">{errors.sex.message}</p>
            )}
          </div>

          {/* Âge */}
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

          {/* Zone */}
          <div className="space-y-2">
            <Label htmlFor="location">Zone géographique / Climat</Label>
            <select
              {...register("location")}
              id="location"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Sélectionnez</option>
              <option value="city">Ville</option>
              <option value="countryside">Campagne</option>
              <option value="humid">Climat humide</option>
              <option value="dry">Climat sec</option>
            </select>
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location.message}</p>
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
              <option value="normal">Normale</option>
              <option value="combination">Mixte</option>
              <option value="oily">Grasse</option>
              <option value="sensitive">Sensible</option>
            </select>
            {errors.skinType && (
              <p className="text-sm text-destructive">{errors.skinType.message}</p>
            )}
          </div>

          {/* Tendances/Préoccupations */}
          <div className="space-y-2">
            <Label>Tendances de votre peau (plusieurs choix possibles)</Label>
            <div className="space-y-2">
              {["Brillance", "Rougeurs", "Sécheresse", "Pores dilatés", "Boutons"].map(
                (item) => (
                  <label key={item} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={item}
                      {...register("skinConcerns")}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm">{item}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Objectifs (max 3) */}
          <div className="space-y-2">
            <Label>Objectifs (maximum 3)</Label>
            <div className="space-y-2">
              {[
                "Hydrater",
                "Réduire acné/points noirs",
                "Lisser rides",
                "Réduire taches",
                "Uniformiser teint",
                "Réduire rougeurs",
                "Fermeté",
                "Anti-pollution",
              ].map((item) => (
                <label key={item} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={item}
                    {...register("objectives")}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
            {errors.objectives && (
              <p className="text-sm text-destructive">{errors.objectives.message}</p>
            )}
          </div>

          {/* Conditions dermato */}
          <div className="space-y-2">
            <Label>Conditions dermatologiques (si applicable)</Label>
            <div className="space-y-2">
              {["Acné sévère", "Eczéma", "Rosacée", "Psoriasis", "Aucune"].map(
                (item) => (
                  <label key={item} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={item}
                      {...register("dermaConditions")}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm">{item}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Routine actuelle */}
          <div className="space-y-2">
            <Label htmlFor="currentRoutineLevel">Nombre de produits actuellement utilisés</Label>
            <select
              {...register("currentRoutineLevel")}
              id="currentRoutineLevel"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Sélectionnez</option>
              <option value="none">Aucune routine</option>
              <option value="1-2">1-2 produits</option>
              <option value="3-4">3-4 produits</option>
              <option value="5+">5+ produits</option>
            </select>
            {errors.currentRoutineLevel && (
              <p className="text-sm text-destructive">
                {errors.currentRoutineLevel.message}
              </p>
            )}
          </div>

          {/* Produits utilisés */}
          <div className="space-y-2">
            <Label>Produits déjà utilisés (cochez si applicable)</Label>
            <div className="space-y-2">
              {[
                "Nettoyant",
                "Tonique",
                "Sérum",
                "Hydratant",
                "AHA/BHA",
                "SPF",
                "Rétinol",
              ].map((item) => (
                <label key={item} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={item}
                    {...register("productsUsed")}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Exposition soleil */}
          <div className="space-y-2">
            <Label htmlFor="sunExposure">Exposition au soleil</Label>
            <select
              {...register("sunExposure")}
              id="sunExposure"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Sélectionnez</option>
              <option value="low">Faible (intérieur, peu de sorties)</option>
              <option value="medium">Moyenne (trajets quotidiens)</option>
              <option value="high">Élevée (extérieur fréquent)</option>
            </select>
            {errors.sunExposure && (
              <p className="text-sm text-destructive">{errors.sunExposure.message}</p>
            )}
          </div>

          {/* Stress */}
          <div className="space-y-2">
            <Label htmlFor="stressLevel">Niveau de stress / Qualité sommeil</Label>
            <select
              {...register("stressLevel")}
              id="stressLevel"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Sélectionnez</option>
              <option value="low">Faible</option>
              <option value="medium">Moyen</option>
              <option value="high">Élevé</option>
            </select>
            {errors.stressLevel && (
              <p className="text-sm text-destructive">{errors.stressLevel.message}</p>
            )}
          </div>

          {/* Préférences */}
          <div className="space-y-2">
            <Label>Préférences produits</Label>
            <div className="space-y-2">
              {[
                "Sans parfum",
                "Vegan",
                "Textures légères",
                "Sans ingrédients controversés",
              ].map((item) => (
                <label key={item} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={item}
                    {...register("preferences")}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">Budget mensuel</Label>
            <select
              {...register("budget")}
              id="budget"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Sélectionnez</option>
              <option value="<20">Moins de 20€</option>
              <option value="20-40">20-40€</option>
              <option value="40-60">40-60€</option>
              <option value="60+">Plus de 60€</option>
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
                simulation personnalisée. Ma photo sera traitée localement et ne sera
                pas transmise à des serveurs externes.
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