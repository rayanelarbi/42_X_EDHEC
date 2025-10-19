"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Camera,
  Shield,
  Info
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const photoConsent = useAppStore((state) => state.photoConsent);
  const setPhotoConsent = useAppStore((state) => state.setPhotoConsent);

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
              <span className="font-medium">Back</span>
            </button>
            <h1 className="font-bold text-2xl tracking-tight text-gray-900">
              Settings
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        {/* Privacy Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-[#0065B7]" />
            <h2 className="text-2xl font-bold text-gray-900">Privacy</h2>
          </div>

          {/* Camera Permission Card */}
          <Card className="p-6 border-2 border-gray-200 mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Camera className="w-6 h-6 text-[#0065B7]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Camera Access
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Allow the app to access your camera for taking photos and skin analysis
                </p>

                {/* Toggle Switch */}
                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      photoConsent ? "bg-green-500" : "bg-gray-300"
                    }`}>
                      {photoConsent && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {photoConsent ? "Enabled" : "Disabled"}
                    </span>
                  </div>

                  <button
                    onClick={() => setPhotoConsent(!photoConsent)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#0065B7] focus:ring-offset-2 ${
                      photoConsent ? "bg-[#0065B7]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                        photoConsent ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Info Card */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#0065B7] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">100% Local Processing:</span> All photos are processed directly on your device. No data is sent to external servers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
          <Card className="p-6 border-2 border-gray-200">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">App Version</span>
                <span className="font-semibold text-gray-900">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Developer</span>
                <span className="font-semibold text-gray-900">Paula's Choice</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Privacy Policy</span>
                <button
                  onClick={() => router.push("/privacy")}
                  className="font-semibold text-[#0065B7] hover:underline"
                >
                  View
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
