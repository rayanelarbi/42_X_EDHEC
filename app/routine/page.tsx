"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Check,
  Calendar as CalendarIcon,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock
} from "lucide-react";

export default function RoutinePage() {
  const router = useRouter();
  const result = useAppStore((state) => state.result);

  // État pour le calendrier
  const [currentDate, setCurrentDate] = useState(new Date());
  const [completedDays, setCompletedDays] = useState<{[key: string]: {morning: boolean, evening: boolean}}>({});

  if (!result) {
    router.push("/");
    return null;
  }

  const morningSteps = result.routine.steps.filter((s) => s.time === "morning");
  const eveningSteps = result.routine.steps.filter((s) => s.time === "evening");

  // Calculer la progression
  const startDate = result.startDate ? new Date(result.startDate) : new Date();
  const endDate = result.endDate ? new Date(result.endDate) : new Date(Date.now() + 84 * 24 * 60 * 60 * 1000);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.ceil((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = Math.min(Math.round((daysPassed / totalDays) * 100), 100);
  const daysRemaining = Math.max(totalDays - daysPassed, 0);

  // Fonctions du calendrier
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const toggleDayCompletion = (day: number, period: 'morning' | 'evening') => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
    setCompletedDays(prev => ({
      ...prev,
      [dateKey]: {
        morning: period === 'morning' ? !prev[dateKey]?.morning : prev[dateKey]?.morning || false,
        evening: period === 'evening' ? !prev[dateKey]?.evening : prev[dateKey]?.evening || false,
      }
    }));
  };

  const isDayCompleted = (day: number, period: 'morning' | 'evening') => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
    return completedDays[dateKey]?.[period] || false;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day &&
           today.getMonth() === currentDate.getMonth() &&
           today.getFullYear() === currentDate.getFullYear();
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-700 hover:text-[#0065B7] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">
                Back
              </span>
            </button>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#0065B7]" />
              <span className="font-bold text-xl tracking-tight text-gray-900">
                My Routine
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Hero Section avec progression */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Your personalized routine
            </h1>
            <p className="text-lg text-gray-600">
              Follow your daily routine and track your progress
            </p>
          </div>

          {/* Progression Card */}
          <Card className="p-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Routine progress
                  </span>
                  <span className="text-2xl font-bold text-[#0065B7]">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div
                    className="bg-gradient-to-r from-[#0065B7] to-[#0088cc] h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">
                      Start
                    </p>
                    <p className="font-bold text-sm text-gray-900">
                      {startDate.toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">
                      Days left
                    </p>
                    <p className="font-bold text-sm text-gray-900">{daysRemaining}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">
                      Expected end
                    </p>
                    <p className="font-bold text-sm text-gray-900">
                      {endDate.toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center bg-white rounded-xl p-4 border-2 border-blue-200 min-w-[140px]">
                <Sparkles className="w-8 h-8 text-[#0065B7] mb-2" />
                <p className="text-xs text-gray-600 text-center mb-1">
                  Goal
                </p>
                <p className="font-bold text-lg text-[#0065B7] text-center">
                  12 weeks
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Calendrier */}
        <Card className="mb-8 p-6 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-[#0065B7]" />
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <Button
                onClick={previousMonth}
                variant="outline"
                size="sm"
                className="border-2 border-gray-300 hover:border-[#0065B7]"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={nextMonth}
                variant="outline"
                size="sm"
                className="border-2 border-gray-300 hover:border-[#0065B7]"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Grille du calendrier */}
          <div className="grid grid-cols-7 gap-2">
            {/* En-têtes des jours */}
            {dayNames.map((day) => (
              <div key={day} className="text-center font-bold text-sm text-gray-600 py-2">
                {day}
              </div>
            ))}

            {/* Espaces vides avant le premier jour */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Jours du mois */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const today = isToday(day);
              const morningDone = isDayCompleted(day, 'morning');
              const eveningDone = isDayCompleted(day, 'evening');
              const bothDone = morningDone && eveningDone;

              return (
                <div
                  key={day}
                  className={`aspect-square border-2 rounded-xl p-2 transition-all ${
                    today
                      ? "border-[#0065B7] bg-blue-50"
                      : bothDone
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <div className={`text-sm font-bold mb-1 ${today ? "text-[#0065B7]" : "text-gray-900"}`}>
                      {day}
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <button
                        onClick={() => toggleDayCompletion(day, 'morning')}
                        className={`flex-1 rounded flex items-center justify-center transition-all ${
                          morningDone
                            ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                        title="Morning"
                      >
                        {morningDone ? <Check className="w-3 h-3" /> : <Sun className="w-3 h-3 text-gray-400" />}
                      </button>
                      <button
                        onClick={() => toggleDayCompletion(day, 'evening')}
                        className={`flex-1 rounded flex items-center justify-center transition-all ${
                          eveningDone
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                        title="Evening"
                      >
                        {eveningDone ? <Check className="w-3 h-3" /> : <Moon className="w-3 h-3 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Légende */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded flex items-center justify-center">
                <Sun className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700 font-medium">
                Morning routine
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded flex items-center justify-center">
                <Moon className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700 font-medium">
                Evening routine
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border-2 border-[#0065B7] bg-blue-50 rounded flex items-center justify-center">
                <CalendarIcon className="w-4 h-4 text-[#0065B7]" />
              </div>
              <span className="text-gray-700 font-medium">
                Today
              </span>
            </div>
          </div>
        </Card>

        {/* Détails de la routine */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Routine du matin */}
          <Card className="p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-md">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Morning routine
                </h2>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  About 5-10 minutes
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {morningSteps.map((step, idx) => (
                <div key={idx} className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-white font-bold text-sm">{step.order}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{step.details}</p>
                      {step.warning && (
                        <div className="mt-2 p-2 bg-amber-100 border border-amber-300 rounded text-xs text-amber-900">
                          ⚠️ {step.warning}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Routine du soir */}
          <Card className="p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                <Moon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Evening routine
                </h2>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  About 5-10 minutes
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {eveningSteps.map((step, idx) => (
                <div key={idx} className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-white font-bold text-sm">{step.order}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{step.details}</p>
                      {step.warning && (
                        <div className="mt-2 p-2 bg-purple-100 border border-purple-300 rounded text-xs text-purple-900">
                          ⚠️ {step.warning}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Statistiques */}
        <Card className="mt-8 p-6 border-2 border-gray-200 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-[#0065B7]" />
            <h2 className="text-2xl font-bold text-gray-900">
              Your progress this month
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center border-2 border-gray-200">
              <p className="text-3xl font-bold text-[#0065B7] mb-1">
                {Object.values(completedDays).filter(d => d.morning && d.evening).length}
              </p>
              <p className="text-sm text-gray-600">
                Complete days
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border-2 border-gray-200">
              <p className="text-3xl font-bold text-amber-600 mb-1">
                {Object.values(completedDays).filter(d => d.morning).length}
              </p>
              <p className="text-sm text-gray-600">
                Mornings
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border-2 border-gray-200">
              <p className="text-3xl font-bold text-purple-600 mb-1">
                {Object.values(completedDays).filter(d => d.evening).length}
              </p>
              <p className="text-sm text-gray-600">
                Evenings
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border-2 border-gray-200">
              <p className="text-3xl font-bold text-green-600 mb-1">
                {Math.round((Object.values(completedDays).filter(d => d.morning && d.evening).length / new Date().getDate()) * 100) || 0}%
              </p>
              <p className="text-sm text-gray-600">
                Consistency
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
