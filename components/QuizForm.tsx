"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, QuizData } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { translations } from "@/lib/translations";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

type QuizStep = {
  id: keyof QuizData;
  type: "single" | "multiple" | "checkbox";
};

const QUIZ_STEPS: QuizStep[] = [
  { id: "sex", type: "single" },
  { id: "ageRange", type: "single" },
  { id: "location", type: "single" },
  { id: "skinType", type: "single" },
  { id: "skinConcerns", type: "multiple" },
  { id: "objectives", type: "multiple" },
  { id: "dermaConditions", type: "multiple" },
  { id: "currentRoutineLevel", type: "single" },
  { id: "productsUsed", type: "multiple" },
  { id: "sunExposure", type: "single" },
  { id: "stressLevel", type: "single" },
  { id: "preferences", type: "multiple" },
  { id: "budget", type: "single" },
];

export default function QuizForm() {
  const router = useRouter();
  const { setQuiz } = useAppStore();
  const t = translations["en"].quiz;

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizData>>({
    skinConcerns: [],
    objectives: [],
    dermaConditions: [],
    productsUsed: [],
    preferences: [],
  });

  const currentQuestion = QUIZ_STEPS[currentStep];
  const progress = ((currentStep + 1) / QUIZ_STEPS.length) * 100;

  // Helper pour auto-avancement sur choix unique
  const handleSingleChoiceWithAutoAdvance = (questionId: keyof QuizData, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
    setTimeout(() => {
      if (currentStep < QUIZ_STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 500);
  };

  const handleNext = () => {
    // Validation
    const currentAnswer = answers[currentQuestion.id];
    if (currentQuestion.type === "checkbox") {
      if (!currentAnswer) {
        alert(t.photoConsentRequired);
        return;
      }
    } else if (currentQuestion.type === "single") {
      if (!currentAnswer) {
        alert("Please select an option");
        return;
      }
    }

    if (currentStep < QUIZ_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz terminé
      setQuiz(answers);
      router.push("/camera");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderQuestion = () => {
    const step = currentQuestion;

    switch (step.id) {
      case "sex":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Label className="text-3xl md:text-4xl font-bold text-gray-900">{t.sex}</Label>
              <p className="text-gray-600 mt-2">Select one option</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["male", "female"].map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => {
                    setAnswers({ ...answers, sex: option as "male" | "female" });
                    setTimeout(() => {
                      if (currentStep < QUIZ_STEPS.length - 1) {
                        setCurrentStep(currentStep + 1);
                      }
                    }, 500);
                  }}
                  className={`relative p-8 border-2 rounded-xl text-left transition-all duration-300 hover:scale-105 ${
                    answers.sex === option
                      ? "border-[#0065B7] bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-[#0065B7] hover:shadow-md bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-900">{option === "male" ? t.male : t.female}</p>
                    {answers.sex === option && (
                      <div className="w-8 h-8 bg-[#0065B7] rounded-full flex items-center justify-center animate-scale-in">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "ageRange":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Label className="text-3xl md:text-4xl font-bold text-gray-900">{t.ageRange}</Label>
              <p className="text-gray-600 mt-2">Select your age range</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(t.ageRanges).map(([key, value]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => handleSingleChoiceWithAutoAdvance("ageRange", key)}
                  className={`relative p-8 border-2 rounded-xl text-left transition-all duration-300 hover:scale-105 ${
                    answers.ageRange === key
                      ? "border-[#0065B7] bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                      : "border-gray-200 hover:border-[#0065B7] hover:shadow-md bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-900">{value}</p>
                    {answers.ageRange === key && (
                      <div className="w-8 h-8 bg-[#0065B7] rounded-full flex items-center justify-center animate-scale-in">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "location":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Label className="text-3xl md:text-4xl font-bold text-gray-900">{t.location}</Label>
              <p className="text-gray-600 mt-2">Select one option</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(t.locationOptions).map(([key, value]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => handleSingleChoiceWithAutoAdvance("location", key)}
                  className={`relative p-8 border-2 rounded-xl text-left transition-all transform hover:scale-105 ${
                    answers.location === key
                      ? "border-[#0065B7] bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                      : "border-gray-200 hover:border-[#0065B7] hover:shadow-md bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-900">{value}</p>
                    {answers.location === key && (
                      <div className="w-8 h-8 bg-[#0065B7] rounded-full flex items-center justify-center animate-scale-in">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "skinType":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Label className="text-3xl md:text-4xl font-bold text-gray-900">{t.skinType}</Label>
              <p className="text-gray-600 mt-2">Select your skin type</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(t.skinTypes).map(([key, value]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => handleSingleChoiceWithAutoAdvance("skinType", key)}
                  className={`relative p-8 border-2 rounded-xl text-left transition-all transform hover:scale-105 ${
                    answers.skinType === key
                      ? "border-[#0065B7] bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                      : "border-gray-200 hover:border-[#0065B7] hover:shadow-md bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-900">{value}</p>
                    {answers.skinType === key && (
                      <div className="w-8 h-8 bg-[#0065B7] rounded-full flex items-center justify-center animate-scale-in">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "skinConcerns":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Label className="text-3xl md:text-4xl font-bold text-gray-900">{t.skinConcerns}</Label>
              <p className="text-gray-600 mt-2">
                Select all that apply
                {answers.skinConcerns && answers.skinConcerns.length > 0 && (
                  <span className="ml-2 text-[#0065B7] font-semibold">
                    ({answers.skinConcerns.length} selected)
                  </span>
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.skinConcernsList.map((item) => {
                const isSelected = answers.skinConcerns?.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => {
                      const current = answers.skinConcerns || [];
                      setAnswers({
                        ...answers,
                        skinConcerns: isSelected
                          ? current.filter((c) => c !== item)
                          : [...current, item],
                      });
                    }}
                    className={`relative p-8 border-2 rounded-xl text-left transition-all transform hover:scale-105 ${
                      isSelected
                        ? "border-[#0065B7] bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                        : "border-gray-200 hover:border-[#0065B7] hover:shadow-md bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-gray-900">{item}</p>
                      {isSelected && (
                        <div className="w-8 h-8 bg-[#0065B7] rounded-full flex items-center justify-center animate-scale-in">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "objectives":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Label className="text-3xl md:text-4xl font-bold text-gray-900">{t.objectives}</Label>
              <p className="text-gray-600 mt-2">
                {t.objectivesMax}
                {answers.objectives && answers.objectives.length > 0 && (
                  <span className="ml-2 text-[#0065B7] font-semibold">
                    ({answers.objectives.length}/3 selected)
                  </span>
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.objectivesList.map((item) => {
                const isSelected = answers.objectives?.includes(item);
                const canSelect = (answers.objectives?.length || 0) < 3;
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => {
                      const current = answers.objectives || [];
                      if (isSelected) {
                        setAnswers({
                          ...answers,
                          objectives: current.filter((c) => c !== item),
                        });
                      } else if (canSelect) {
                        setAnswers({
                          ...answers,
                          objectives: [...current, item],
                        });
                      }
                    }}
                    disabled={!isSelected && !canSelect}
                    className={`relative p-8 border-2 rounded-xl text-left transition-all transform hover:scale-105 ${
                      isSelected
                        ? "border-[#0065B7] bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                        : !canSelect
                        ? "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                        : "border-gray-200 hover:border-[#0065B7] hover:shadow-md bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-gray-900">{item}</p>
                      {isSelected && (
                        <div className="w-8 h-8 bg-[#0065B7] rounded-full flex items-center justify-center animate-scale-in">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "dermaConditions":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Label className="text-3xl md:text-4xl font-bold text-gray-900">{t.dermaConditions}</Label>
              <p className="text-gray-600 mt-2">
                Select if applicable
                {answers.dermaConditions && answers.dermaConditions.length > 0 && (
                  <span className="ml-2 text-[#0065B7] font-semibold">
                    ({answers.dermaConditions.length} selected)
                  </span>
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.dermaConditionsList.map((item) => {
                const isSelected = answers.dermaConditions?.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => {
                      const current = answers.dermaConditions || [];
                      setAnswers({
                        ...answers,
                        dermaConditions: isSelected
                          ? current.filter((c) => c !== item)
                          : [...current, item],
                      });
                    }}
                    className={`relative p-8 border-2 rounded-xl text-left transition-all transform hover:scale-105 ${
                      isSelected
                        ? "border-[#0065B7] bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                        : "border-gray-200 hover:border-[#0065B7] hover:shadow-md bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-gray-900">{item}</p>
                      {isSelected && (
                        <div className="w-8 h-8 bg-[#0065B7] rounded-full flex items-center justify-center animate-scale-in">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "currentRoutineLevel":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Label className="text-3xl md:text-4xl font-bold text-gray-900">{t.currentRoutineLevel}</Label>
              <p className="text-gray-600 mt-2">Select one option</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(t.routineLevels).map(([key, value]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => handleSingleChoiceWithAutoAdvance("currentRoutineLevel", key)}
                  className={`relative p-8 border-2 rounded-xl text-left transition-all transform hover:scale-105 ${
                    answers.currentRoutineLevel === key
                      ? "border-[#0065B7] bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                      : "border-gray-200 hover:border-[#0065B7] hover:shadow-md bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-gray-900">{value}</p>
                    {answers.currentRoutineLevel === key && (
                      <div className="w-8 h-8 bg-[#0065B7] rounded-full flex items-center justify-center animate-scale-in">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "productsUsed":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Label className="text-3xl md:text-4xl font-bold text-gray-900">{t.productsUsed}</Label>
              <p className="text-gray-600 mt-2">
                Select all that you use
                {answers.productsUsed && answers.productsUsed.length > 0 && (
                  <span className="ml-2 text-[#0065B7] font-semibold">
                    ({answers.productsUsed.length} selected)
                  </span>
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.productsList.map((item) => {
                const isSelected = answers.productsUsed?.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => {
                      const current = answers.productsUsed || [];
                      setAnswers({
                        ...answers,
                        productsUsed: isSelected
                          ? current.filter((c) => c !== item)
                          : [...current, item],
                      });
                    }}
                    className={`relative p-8 border-2 rounded-xl text-left transition-all transform hover:scale-105 ${
                      isSelected
                        ? "border-[#0065B7] bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                        : "border-gray-200 hover:border-[#0065B7] hover:shadow-md bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-gray-900">{item}</p>
                      {isSelected && (
                        <div className="w-8 h-8 bg-[#0065B7] rounded-full flex items-center justify-center animate-scale-in">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "sunExposure":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Label className="text-3xl md:text-4xl font-bold text-gray-900">{t.sunExposure}</Label>
              <p className="text-gray-600 mt-2">Select one option</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(t.sunExposureLevels).map(([key, value]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => handleSingleChoiceWithAutoAdvance("sunExposure", key)}
                  className={`relative p-8 border-2 rounded-xl text-left transition-all transform hover:scale-105 ${
                    answers.sunExposure === key
                      ? "border-[#0065B7] bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                      : "border-gray-200 hover:border-[#0065B7] hover:shadow-md bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-gray-900">{value}</p>
                    {answers.sunExposure === key && (
                      <div className="w-8 h-8 bg-[#0065B7] rounded-full flex items-center justify-center animate-scale-in">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "stressLevel":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Label className="text-3xl md:text-4xl font-bold text-gray-900">{t.stressLevel}</Label>
              <p className="text-gray-600 mt-2">Select one option</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(t.stressLevels).map(([key, value]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => handleSingleChoiceWithAutoAdvance("stressLevel", key)}
                  className={`relative p-8 border-2 rounded-xl text-left transition-all transform hover:scale-105 ${
                    answers.stressLevel === key
                      ? "border-[#0065B7] bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                      : "border-gray-200 hover:border-[#0065B7] hover:shadow-md bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-gray-900">{value}</p>
                    {answers.stressLevel === key && (
                      <div className="w-8 h-8 bg-[#0065B7] rounded-full flex items-center justify-center animate-scale-in">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Label className="text-3xl md:text-4xl font-bold text-gray-900">{t.preferences}</Label>
              <p className="text-gray-600 mt-2">
                Select your preferences
                {answers.preferences && answers.preferences.length > 0 && (
                  <span className="ml-2 text-[#0065B7] font-semibold">
                    ({answers.preferences.length} selected)
                  </span>
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.preferencesList.map((item) => {
                const isSelected = answers.preferences?.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => {
                      const current = answers.preferences || [];
                      setAnswers({
                        ...answers,
                        preferences: isSelected
                          ? current.filter((c) => c !== item)
                          : [...current, item],
                      });
                    }}
                    className={`relative p-8 border-2 rounded-xl text-left transition-all transform hover:scale-105 ${
                      isSelected
                        ? "border-[#0065B7] bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                        : "border-gray-200 hover:border-[#0065B7] hover:shadow-md bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-gray-900">{item}</p>
                      {isSelected && (
                        <div className="w-8 h-8 bg-[#0065B7] rounded-full flex items-center justify-center animate-scale-in">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "budget":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Label className="text-3xl md:text-4xl font-bold text-gray-900">{t.budget}</Label>
              <p className="text-gray-600 mt-2">Select one option</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(t.budgetRanges).map(([key, value]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => handleSingleChoiceWithAutoAdvance("budget", key)}
                  className={`relative p-8 border-2 rounded-xl text-left transition-all transform hover:scale-105 ${
                    answers.budget === key
                      ? "border-[#0065B7] bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                      : "border-gray-200 hover:border-[#0065B7] hover:shadow-md bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-gray-900">{value}</p>
                    {answers.budget === key && (
                      <div className="w-8 h-8 bg-[#0065B7] rounded-full flex items-center justify-center animate-scale-in">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Enhanced Progress Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#0065B7] flex items-center justify-center">
                <span className="text-white font-bold text-sm">{currentStep + 1}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  STEP {currentStep + 1} OF {QUIZ_STEPS.length}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {Math.round(progress)}% complete
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Time remaining</p>
              <p className="text-sm font-semibold text-gray-900">≈ {Math.ceil((QUIZ_STEPS.length - currentStep) * 0.3)} min</p>
            </div>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-[#0065B7] to-[#0088cc] transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
          {renderQuestion()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="border-2 border-gray-300 hover:border-[#0065B7] hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg px-6 py-6 transition-all"
            size="lg"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            <span className="font-medium">Previous</span>
          </Button>

          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-[#0065B7] to-[#0088cc] hover:from-[#004a8a] hover:to-[#006699] text-white rounded-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all group"
            size="lg"
          >
            <span className="font-medium">
              {currentStep === QUIZ_STEPS.length - 1 ? "Finish" : "Next"}
            </span>
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
