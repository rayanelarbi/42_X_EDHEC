"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Sparkles, Award } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/lib/translations";

export default function Home() {
  const t = translations["en"];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Paula's Choice</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-[#0065B7] transition">
                How it works
              </a>
              <a href="#benefits" className="text-sm font-medium text-gray-700 hover:text-[#0065B7] transition">
                Benefits
              </a>
              <Link href="/quiz">
                <Button className="bg-[#0065B7] hover:bg-[#004a8a] text-white px-6 py-2">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Large and Impactful */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-6">
              <Award className="w-4 h-4 text-[#0065B7] mr-2" />
              <span className="text-sm font-semibold text-[#0065B7]">
                Science-Based Skincare
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your personalized<br /><span className="text-[#0065B7]">skincare routine</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Discover a routine tailored to your skin type through our scientific analysis and personalized recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/quiz">
                <Button size="lg" className="bg-[#0065B7] hover:bg-[#004a8a] text-white px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all group">
                  {t.home.startQuiz}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-[#0065B7] hover:text-[#0065B7] px-8 py-6 text-lg font-medium">
                Learn more
              </Button>
            </div>

            <div className="mt-12 flex justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>2 min</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>100% free</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Local data</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Visual Steps */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to a personalized routine
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 h-full transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#0065B7] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                  1
                </div>
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-md">
                  <svg className="w-10 h-10 text-[#0065B7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  Questionnaire
                </h3>
                <p className="text-gray-700 text-center leading-relaxed">
                  Answer a few questions about your skin, habits, and goals.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 h-full transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#0065B7] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                  2
                </div>
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-md">
                  <svg className="w-10 h-10 text-[#0065B7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  Photo
                </h3>
                <p className="text-gray-700 text-center leading-relaxed">
                  Take or upload a photo to see a before/after simulation.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 h-full transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#0065B7] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                  3
                </div>
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-md">
                  <Sparkles className="w-10 h-10 text-[#0065B7]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  Results
                </h3>
                <p className="text-gray-700 text-center leading-relaxed">
                  Get your personalized routine with tailored products and usage advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why choose us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A scientific and transparent approach for your skin
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-[#0065B7]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                100% Local
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your data stays on your device. No transmission to servers.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-[#0065B7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Science-Based
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Recommendations based on scientific and dermatological studies.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-[#0065B7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Transparency
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Detailed ingredients, concentrations, and complete product traceability.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-[#0065B7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Personalized
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Routine tailored to your skin type, concerns, and goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#0065B7] to-[#004a8a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Discover your personalized routine in 2 minutes
          </p>
          <Link href="/quiz">
            <Button size="lg" className="bg-white text-[#0065B7] hover:bg-gray-100 px-8 py-6 text-lg font-medium shadow-xl hover:shadow-2xl transition-all group">
              {t.home.startQuiz}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}