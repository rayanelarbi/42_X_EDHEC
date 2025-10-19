"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Edit2, Check, X } from "lucide-react";

export default function ProfileEditPage() {
  const router = useRouter();
  const quiz = useAppStore((state) => state.quiz);
  const setQuiz = useAppStore((state) => state.setQuiz);
  const t = translations["en"].quiz;

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<any>(null);

  if (!quiz || Object.keys(quiz).length === 0) {
    router.push("/profile");
    return null;
  }

  const startEditing = (field: string, currentValue: any) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue(null);
  };

  const saveEdit = (field: string) => {
    setQuiz({ [field]: tempValue });
    setEditingField(null);
    setTempValue(null);
  };

  const toggleMultipleChoice = (field: string, value: string) => {
    const currentValues = tempValue || [];

    if (!currentValues.includes(value)) {
      if (field === "objectives" && currentValues.length >= 3) {
        return;
      }
    }

    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    setTempValue(newValues);
  };

  const renderField = (
    field: string,
    label: string,
    currentValue: any,
    options?: { [key: string]: string } | string[],
    isMultiple = false
  ) => {
    const isEditing = editingField === field;

    return (
      <Card key={field} className="p-6 border-2 border-gray-200 hover:border-gray-300 transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-2">{label}</h3>
            {!isEditing && (
              <div className="text-gray-700">
                {isMultiple ? (
                  <div className="flex flex-wrap gap-2">
                    {(currentValue as string[])?.map((val: string) => (
                      <span
                        key={val}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {val}
                      </span>
                    )) || (
                      <span className="text-gray-400 italic">
                        No selection
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-base">
                    {options
                      ? Array.isArray(options)
                        ? currentValue || "Not provided"
                        : options[currentValue as keyof typeof options] || currentValue || "Not provided"
                      : currentValue || "Not provided"}
                  </p>
                )}
              </div>
            )}
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => startEditing(field, currentValue)}
              className="ml-4 border-2 border-gray-300 hover:border-[#0065B7] hover:bg-blue-50"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}
        </div>

        {isEditing && (
          <div className="space-y-4 border-t-2 border-gray-200 pt-4">
            {isMultiple && field === "objectives" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-blue-800">
                  Maximum 3 objectives ({tempValue?.length || 0}/3)
                </p>
              </div>
            )}
            {isMultiple ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(Array.isArray(options) ? options : Object.keys(options || {})).map((option) => {
                  const value = typeof option === "string" ? option : option;
                  const isSelected = tempValue?.includes(value);
                  const isDisabled = !isSelected && field === "objectives" && tempValue?.length >= 3;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleMultipleChoice(field, value)}
                      disabled={isDisabled}
                      className={`p-3 border-2 rounded-lg text-left transition-all ${
                        isSelected
                          ? "border-[#0065B7] bg-blue-50 ring-2 ring-blue-200"
                          : isDisabled
                          ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{value}</span>
                        {isSelected && (
                          <div className="w-5 h-5 bg-[#0065B7] rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(options || {}).map(([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTempValue(key)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      tempValue === key
                        ? "border-[#0065B7] bg-blue-50 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{value}</span>
                      {tempValue === key && (
                        <div className="w-5 h-5 bg-[#0065B7] rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => saveEdit(field)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={cancelEditing}
                variant="outline"
                className="flex-1 border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 text-gray-700 hover:text-[#0065B7] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Profile</span>
            </button>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              Edit Information
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Edit Your Information
          </h1>
          <p className="text-lg text-gray-600">
            Update your answers to refine your recommendations
          </p>
        </div>

        {/* Fields Grid */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0065B7] rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              Basic Information
            </h2>
            <div className="grid gap-4">
              {renderField("sex", t.sex, quiz.sex, { male: t.male, female: t.female })}
              {renderField("ageRange", t.ageRange, quiz.ageRange, t.ageRanges)}
              {renderField("location", t.location, quiz.location, t.locationOptions)}
            </div>
          </div>

          {/* Skin Type */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0065B7] rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              Your Skin
            </h2>
            <div className="grid gap-4">
              {renderField("skinType", t.skinType, quiz.skinType, t.skinTypes)}
              {renderField(
                "skinConcerns",
                t.skinConcerns,
                quiz.skinConcerns,
                t.skinConcernsList,
                true
              )}
              {renderField("objectives", t.objectives, quiz.objectives, t.objectivesList, true)}
              {renderField(
                "dermaConditions",
                t.dermaConditions,
                quiz.dermaConditions,
                t.dermaConditionsList,
                true
              )}
            </div>
          </div>

          {/* Lifestyle */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0065B7] rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              Lifestyle
            </h2>
            <div className="grid gap-4">
              {renderField(
                "currentRoutineLevel",
                t.currentRoutineLevel,
                quiz.currentRoutineLevel,
                t.routineLevels
              )}
              {renderField("sunExposure", t.sunExposure, quiz.sunExposure, t.sunExposureLevels)}
              {renderField("stressLevel", t.stressLevel, quiz.stressLevel, t.stressLevels)}
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0065B7] rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              Preferences
            </h2>
            <div className="grid gap-4">
              {renderField(
                "preferences",
                t.preferences,
                quiz.preferences,
                t.preferencesList,
                true
              )}
              {renderField("budget", t.budget, quiz.budget, t.budgetRanges)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.push("/result")}
            className="flex-1 bg-[#0065B7] hover:bg-[#004a8a] text-white py-6 text-lg"
          >
            View My Results
          </Button>
          <Button
            onClick={() => router.push("/profile")}
            variant="outline"
            className="flex-1 border-2 border-gray-300 hover:border-gray-400 py-6 text-lg"
          >
            Back to Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
