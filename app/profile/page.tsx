"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  User,
  Calendar,
  Settings,
  RefreshCw,
  ChevronRight,
  ShoppingBag,
  Sparkles
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const quiz = useAppStore((state) => state.quiz);
  const photoBase64 = useAppStore((state) => state.photoBase64);
  const resetStore = useAppStore((state) => state.reset);

  if (!quiz || Object.keys(quiz).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No profile
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't completed the questionnaire yet
          </p>
          <Button onClick={() => router.push("/quiz")} className="bg-[#0065B7] hover:bg-[#004a8a]">
            Start questionnaire
          </Button>
        </Card>
      </div>
    );
  }

  const navigationSections = [
    {
      title: "Personal Information",
      description: "View and edit your profile details",
      icon: User,
      path: "/profile/edit",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "My Routine",
      description: "View your daily skincare routine",
      icon: Calendar,
      path: "/routine",
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "My Photos",
      description: "View your skin analysis photos",
      icon: Sparkles,
      path: "/result",
      gradient: "from-pink-500 to-pink-600",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600"
    },
    {
      title: "Products",
      description: "Browse and shop recommended products",
      icon: ShoppingBag,
      path: "/cart",
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ];

  const handleStartOver = () => {
    if (confirm("Are you sure you want to start over? This will reset all your data.")) {
      resetStore();
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-2">
              <User className="w-6 h-6 text-[#0065B7]" />
              <span className="font-bold text-2xl tracking-tight text-gray-900">
                My Profile
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Welcome back!
          </h1>
          <p className="text-lg text-gray-600">
            Access all your skincare information in one place
          </p>
        </div>

        {/* Navigation Sections Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {navigationSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.path}
                onClick={() => router.push(section.path)}
                className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#0065B7] transition-all duration-300 hover:shadow-lg text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-14 h-14 ${section.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-7 h-7 ${section.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#0065B7] transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0065B7] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Settings Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>
          <button
            onClick={() => router.push("/settings")}
            className="group w-full bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Settings className="w-7 h-7 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    App Settings
                  </h3>
                  <p className="text-sm text-gray-600">
                    Preferences, notifications, and more
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Start Over Button */}
        <div className="border-2 border-red-200 rounded-2xl p-6 bg-red-50">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Start Over
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Reset all your data and start fresh with a new skin analysis
              </p>
              <Button
                onClick={handleStartOver}
                variant="outline"
                className="border-2 border-red-300 hover:border-red-500 hover:bg-red-100 text-red-700 font-semibold"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Everything
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
