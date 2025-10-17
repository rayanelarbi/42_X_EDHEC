"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const questions = [
  {
    id: "sex",
    type: "single",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "non-binary", label: "Non-binary" },
      { value: "prefer-not-to-say", label: "Prefer not to say" },
    ],
  },
  {
    id: "ageRange",
    type: "single",
    options: [
      { value: "18-25", label: "18-25" },
      { value: "26-35", label: "26-35" },
      { value: "36-45", label: "36-45" },
      { value: "46+", label: "46+" },
    ],
  },
  {
    id: "location",
    type: "single",
    options: [
      { value: "city", label: "Urban environment" },
      { value: "countryside", label: "Rural environment" },
      { value: "humid", label: "Humid climate" },
      { value: "dry", label: "Dry climate" },
    ],
  },
  {
    id: "skinType",
    type: "single",
    options: [
      { value: "dry", label: "Dry" },
      { value: "normal", label: "Normal" },
      { value: "combination", label: "Combination" },
      { value: "oily", label: "Oily" },
      { value: "sensitive", label: "Sensitive" },
    ],
  },
  {
    id: "skinConcerns",
    type: "multiple",
    options: [
      { value: "acne", label: "Acne & Breakouts", description: "Active breakouts, blackheads, whiteheads" },
      { value: "hyperpigmentation", label: "Hyperpigmentation", description: "Dark spots, melasma, post-inflammatory marks" },
      { value: "anti-aging", label: "Anti-aging", description: "Fine lines, wrinkles, loss of firmness" },
      { value: "pores", label: "Enlarged Pores", description: "Visible pores, congestion" },
      { value: "dryness", label: "Dryness & Dehydration", description: "Tight feeling, flakiness, lack of moisture" },
      { value: "sensitivity", label: "Sensitivity & Redness", description: "Irritation, rosacea, reactive skin" },
      { value: "texture", label: "Uneven Texture", description: "Roughness, bumpiness, uneven surface" },
      { value: "dullness", label: "Dullness", description: "Lack of radiance, tired-looking skin" },
      { value: "oiliness", label: "Excess Oil", description: "Shine, greasy feeling, sebum production" },
    ],
  },
  {
    id: "objectives",
    type: "multiple",
    maxSelections: 3,
    options: [
      { value: "anti-aging", label: "Anti-aging", description: "Reduce fine lines, improve firmness" },
      { value: "clear-skin", label: "Clear, healthy skin", description: "Achieve balanced, blemish-free skin" },
      { value: "even-tone", label: "Even skin tone", description: "Reduce dark spots, brighten complexion" },
      { value: "hydration", label: "Optimal hydration", description: "Improve moisture retention" },
      { value: "protection", label: "Sun protection", description: "Prevent UV damage, maintain skin health" },
      { value: "prevention", label: "Prevent future damage", description: "Protect against environmental stressors" },
      { value: "repair", label: "Skin repair", description: "Heal damage, improve skin barrier" },
      { value: "radiance", label: "Glowing complexion", description: "Achieve healthy, luminous skin" },
    ],
  },
  {
    id: "currentRoutineLevel",
    type: "single",
    options: [
      { value: "none", label: "No routine" },
      { value: "1-2", label: "1-2 products" },
      { value: "3-4", label: "3-4 products" },
      { value: "5+", label: "5+ products" },
    ],
  },
  {
    id: "sunExposure",
    type: "single",
    options: [
      { value: "low", label: "Low (mostly indoors)" },
      { value: "medium", label: "Medium (some outdoor time)" },
      { value: "high", label: "High (lots of outdoor time)" },
    ],
  },
  {
    id: "stressLevel",
    type: "single",
    options: [
      { value: "low", label: "Low stress" },
      { value: "medium", label: "Medium stress" },
      { value: "high", label: "High stress" },
    ],
  },
  {
    id: "budget",
    type: "single",
    options: [
      { value: "<20", label: "Under $20/month" },
      { value: "20-40", label: "$20-40/month" },
      { value: "40-60", label: "$40-60/month" },
      { value: "60+", label: "$60+/month" },
    ],
  },
  {
    id: "dermaConditions",
    type: "multiple",
    options: [
      { value: "none", label: "None", description: "No diagnosed skin conditions" },
      { value: "acne", label: "Acne", description: "Mild to severe acne" },
      { value: "rosacea", label: "Rosacea", description: "Facial redness and inflammation" },
      { value: "eczema", label: "Eczema/Atopic Dermatitis", description: "Dry, itchy, inflamed skin" },
      { value: "psoriasis", label: "Psoriasis", description: "Scaly, red patches" },
      { value: "seborrheic-dermatitis", label: "Seborrheic Dermatitis", description: "Scaly, oily patches" },
    ],
  },
  {
    id: "preferences",
    type: "multiple",
    options: [
      { value: "fragrance-free", label: "Fragrance-free", description: "No added fragrances or essential oils" },
      { value: "cruelty-free", label: "Cruelty-free", description: "Not tested on animals" },
      { value: "vegan", label: "Vegan", description: "No animal-derived ingredients" },
      { value: "minimal-ingredients", label: "Minimal ingredients", description: "Simple, clean formulations" },
      { value: "clinical-proven", label: "Clinically proven", description: "Scientifically tested efficacy" },
      { value: "organic", label: "Organic", description: "Organic and natural ingredients" },
    ],
  },
];

export default function QuizForm() {
  const router = useRouter();
  const { language, setQuiz } = useAppStore();
  const t = translations[language];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  
  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers };
    
    if (currentQuestion.type === "multiple") {
      if (!newAnswers[currentQuestion.id]) {
        newAnswers[currentQuestion.id] = [];
      }
      
      const currentAnswers = newAnswers[currentQuestion.id] as string[];
      const maxSelections = currentQuestion.maxSelections || currentQuestion.options.length;
      
      if (currentAnswers.includes(value)) {
        newAnswers[currentQuestion.id] = currentAnswers.filter(v => v !== value);
      } else if (currentAnswers.length < maxSelections) {
        newAnswers[currentQuestion.id] = [...currentAnswers, value];
      }
    } else {
      newAnswers[currentQuestion.id] = value;
    }
    
    setAnswers(newAnswers);
    
    // Auto-advance for single choice questions
    if (currentQuestion.type === "single") {
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }, 500);
    }
  };
  
  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = () => {
    const finalAnswers = {
      ...answers,
      photoConsent: true, // Auto-consent for photo
    };
    
    setQuiz(finalAnswers);
    router.push("/camera");
  };
  
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="text-center text-sm text-slate-600">
        Question {currentStep + 1} of {questions.length}
      </div>

      {/* Question Card */}
      <Card className="border-2 border-blue-100 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              {t.quiz.questions[currentQuestion.id as keyof typeof t.quiz.questions] || currentQuestion.id}
            </h2>
            {currentQuestion.type === "multiple" && (
              <div className="text-slate-600">
                {currentQuestion.maxSelections ? (
                  <p>
                    Select up to {currentQuestion.maxSelections} options
                    {answers[currentQuestion.id] && (
                      <span className="ml-2 font-medium text-blue-600">
                        ({answers[currentQuestion.id]?.length || 0} selected)
                      </span>
                    )}
                  </p>
                ) : (
                  <p>
                    Select all that apply
                    {answers[currentQuestion.id] && (
                      <span className="ml-2 font-medium text-blue-600">
                        ({answers[currentQuestion.id]?.length || 0} selected)
                      </span>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {currentQuestion.options.map((option) => {
              const isSelected = currentQuestion.type === "single" 
                ? answers[currentQuestion.id] === option.value
                : (answers[currentQuestion.id] as string[] || []).includes(option.value);
              
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleAnswer(option.value)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200"
                      : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800 text-lg mb-2">
                        {option.label}
                      </div>
                      {(option as any).description && (
                        <div className="text-sm text-slate-600 leading-relaxed">
                          {(option as any).description}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                {t.quiz.previous}
              </Button>
            )}
            
            {currentStep === 0 && <div></div>}

            {currentQuestion.type === "multiple" && !isLastStep && (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!answers[currentQuestion.id] || answers[currentQuestion.id]?.length === 0}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.quiz.next}
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}

            {isLastStep && (
              <Button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {t.quiz.submit}
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}