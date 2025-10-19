"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { determinePersonaAndProduct } from "@/lib/scoring";
import { buildRoutine } from "@/lib/routineTranslations";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Sparkles, Loader2, Image as ImageIcon, ArrowLeft, ArrowRight, Trash2, X, TrendingDown, TrendingUp, Calendar, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import { translations } from "@/lib/translations";
import { analyzeSkin, SkinAnalysisResult } from "@/lib/skinAnalysis";
import { compressImage } from "@/lib/imageCompression";
import { simulateAfter } from "@/lib/imageFilters";

export default function ResultPage() {
  const router = useRouter();
  const quiz = useAppStore((state) => state.quiz);
  const photoBase64 = useAppStore((state) => state.photoBase64);
  const photos = useAppStore((state) => state.photos);
  const result = useAppStore((state) => state.result);
  const skinAnalysis = useAppStore((state) => state.skinAnalysis);
  const setResult = useAppStore((state) => state.setResult);
  const setSkinAnalysis = useAppStore((state) => state.setSkinAnalysis);
  const addPhotoToHistory = useAppStore((state) => state.addPhotoToHistory);
  const removePhotoFromHistory = useAppStore((state) => state.removePhotoFromHistory);
  const t = translations["en"];

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzedPhoto, setLastAnalyzedPhoto] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [detailView, setDetailView] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [fullscreenImageType, setFullscreenImageType] = useState<"before" | "after" | null>(null);
  const [showDetectionBoxes, setShowDetectionBoxes] = useState(true);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Ajouter la photo actuelle à la liste pour le swipe en fullscreen
    const allPhotos = photoBase64 ? [{ photoBase64, date: new Date().toISOString(), analysis: skinAnalysis }, ...photos] : photos;

    if (isLeftSwipe && selectedPhotoIndex !== null && selectedPhotoIndex < allPhotos.length - 1) {
      // Swipe left = next photo (plus récente)
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
    if (isRightSwipe && selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      // Swipe right = previous photo (plus ancienne)
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  // Lancer l'analyse de peau si on a une photo et (pas encore d'analyse OU photo différente)
  useEffect(() => {
    if (photoBase64 && photoBase64 !== lastAnalyzedPhoto && !isAnalyzing && result) {
      console.log("🔍 Nouvelle analyse de peau démarrée...");
      setIsAnalyzing(true);
      // Réinitialiser l'ancienne analyse
      setSkinAnalysis(null);

      // Étape 1: Compresser la photo
      compressImage(photoBase64)
        .then(compressedPhoto => {
          console.log("📦 Photo compressée");

          // Étape 2: Analyser la peau
          return analyzeSkin(compressedPhoto).then(analysis => ({ compressedPhoto, analysis }));
        })
        .then(({ compressedPhoto, analysis }) => {
          console.log("✅ Analyse terminée:", analysis);

          // Étape 3: Générer la version "enhanced"
          const img = new Image();
          img.onload = async () => {
            try {
              const enhancedCanvas = await simulateAfter(img, result.productKey, analysis.problems);
              const enhancedBase64 = enhancedCanvas.toDataURL('image/jpeg', 0.75);

              console.log("✨ Photo enhanced générée");

              // Étape 4: Sauvegarder tout
              setSkinAnalysis(analysis);
              setLastAnalyzedPhoto(photoBase64);
              setIsAnalyzing(false);

              // Ajouter à l'historique avec la version enhanced
              addPhotoToHistory(compressedPhoto, undefined, analysis, enhancedBase64);
            } catch (error) {
              console.error("❌ Erreur lors de la génération enhanced:", error);
              setIsAnalyzing(false);
            }
          };
          img.src = compressedPhoto;
        })
        .catch(error => {
          console.error("❌ Erreur lors de l'analyse de peau:", error);
          setIsAnalyzing(false);
        });
    }
  }, [photoBase64, lastAnalyzedPhoto, isAnalyzing, result, setSkinAnalysis, addPhotoToHistory]);

  useEffect(() => {
    if (!result && quiz?.sex && quiz?.skinType) {
      const scoring = determinePersonaAndProduct(quiz as any);
      const routine = buildRoutine(scoring.productKey, "en");

      queueMicrotask(() => {
        setResult({
          persona: scoring.persona,
          productKey: scoring.productKey,
          recommendedProducts: scoring.recommendedProducts,
          routine,
          ingredients: scoring.ingredients,
          irritationGuard: scoring.irritationGuard,
          summary: {
            skinType: quiz.skinType || "normal",
            mainConcerns: quiz.skinConcerns || [],
            objectives: quiz.objectives || [],
          },
        });
      });
    }
  }, [quiz, result, setResult]);

  // Calculer les statistiques de progression
  const calculateProgress = () => {
    if (photos.length < 2) return null;

    const photosWithAnalysis = photos.filter(p => p.analysis);
    if (photosWithAnalysis.length < 2) return null;

    const oldest = photosWithAnalysis[0];
    const newest = photosWithAnalysis[photosWithAnalysis.length - 1];

    const oldScore = oldest.analysis.overallScore;
    const newScore = newest.analysis.overallScore;
    const improvement = newScore - oldScore;

    return {
      improvement,
      oldScore,
      newScore,
      days: Math.floor((new Date(newest.date).getTime() - new Date(oldest.date).getTime()) / (1000 * 60 * 60 * 24)),
    };
  };

  const progress = calculateProgress();

  // Afficher uniquement les photos de l'historique (pas la current)
  const allPhotos = photos;

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="max-w-md shadow-xl">
          <CardHeader>
            <CardTitle>{t.common.loading}</CardTitle>
            <CardDescription>
              Generating your personalized routine
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <span className="font-bold text-2xl tracking-tight text-gray-900">Paula's Choice</span>
              <div className="flex items-center px-3 py-1.5 bg-green-100 rounded-full">
                <Sparkles className="w-4 h-4 text-green-700 mr-1.5" />
                <span className="text-xs font-semibold text-green-700">
                  {allPhotos.length} Photo{allPhotos.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Hero */}
        <div className="py-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 text-center">
            My Photos
          </h1>
          <p className="text-gray-600 text-center">Track your skin progress over time</p>
        </div>

        {/* Stats Section */}
        {progress && showStats && (
          <Card className="mb-6 overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Progress Stats</h3>
                    <p className="text-sm text-gray-600">{progress.days} days tracking</p>
                  </div>
                </div>
                <button onClick={() => setShowStats(false)} className="text-gray-400 hover:text-gray-600">
                  <ChevronUp className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-purple-100 text-center">
                  <div className={`text-2xl font-bold ${progress.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {progress.improvement > 0 ? '+' : ''}{Math.round(progress.improvement)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1 flex items-center justify-center gap-1">
                    {progress.improvement > 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600" />
                    )}
                    Score Change
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-purple-100 text-center">
                  <div className="text-2xl font-bold text-gray-900">{Math.round(progress.newScore)}</div>
                  <div className="text-xs text-gray-600 mt-1">Current Score</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-purple-100 text-center">
                  <div className="text-2xl font-bold text-gray-900">{allPhotos.length}</div>
                  <div className="text-xs text-gray-600 mt-1">Total Photos</div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {!showStats && progress && (
          <button
            onClick={() => setShowStats(true)}
            className="w-full mb-6 p-3 bg-purple-100 hover:bg-purple-200 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-900">Show Progress Stats</span>
            <ChevronDown className="w-4 h-4 text-purple-600" />
          </button>
        )}

        {/* AI Analysis Loading */}
        {isAnalyzing && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              <span className="text-lg font-semibold text-gray-900">
                AI Skin Analysis in progress...
              </span>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              Detecting skin concerns and problem areas
            </p>
          </div>
        )}

        {/* MY PHOTOS SECTION - Gallery */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-purple-600" />
              Gallery
            </h2>
            <Button
              onClick={() => router.push("/camera")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
          </div>

          {/* Gallery Grid */}
          {allPhotos.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {allPhotos.map((photo, idx) => {
                const photoData = photo as any;
                const hasAnalysis = photoData.analysis && photoData.analysis.overallScore;

                return (
                  <div key={idx} className="relative group">
                    <button
                      onClick={() => {
                        setSelectedPhotoIndex(idx);
                        setDetailView(true);
                      }}
                      className="w-full"
                    >
                      <img
                        src={photoData.photoBase64}
                        alt={`Photo ${idx + 1}`}
                        className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200 group-hover:border-purple-600 transition-all"
                      />
                      <div className="absolute bottom-2 left-2 right-2">
                        {hasAnalysis ? (
                          <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg flex items-center justify-between">
                            <span>Score: {Math.round(photoData.analysis.overallScore)}</span>
                            <Sparkles className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="bg-gray-800/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg text-center">
                            {new Date(photoData.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        )}
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete this photo?")) {
                          removePhotoFromHistory(idx);
                        }
                      }}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center border-2 border-dashed border-gray-300">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No photos yet</h3>
              <p className="text-gray-600 mb-4">Take a photo to start tracking your skin progress</p>
              <Button
                onClick={() => router.push("/camera")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Your First Photo
              </Button>
            </Card>
          )}
        </div>

        {/* Detail View Modal */}
        {detailView && selectedPhotoIndex !== null && allPhotos[selectedPhotoIndex] && (
          <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto pb-20">
            <div className="min-h-screen p-4 pb-24">
              {/* Header */}
              <div className="sticky top-0 bg-black/50 backdrop-blur-sm p-4 rounded-xl mb-4 flex items-center justify-between">
                <button
                  onClick={() => setDetailView(false)}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <div className="text-white text-sm font-semibold">
                  {selectedPhotoIndex + 1} / {allPhotos.length}
                </div>
                <div className="w-10 h-10"></div>
              </div>

              {/* Before/After Photos */}
              <div
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className="mb-4"
              >
                {allPhotos[selectedPhotoIndex].enhancedBase64 ? (
                  // Show Before/After comparison
                  <div className="max-w-2xl mx-auto">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Before */}
                      <button
                        onClick={() => {
                          setFullscreenImage(allPhotos[selectedPhotoIndex].photoBase64);
                          setFullscreenImageType("before");
                        }}
                        className="relative group cursor-pointer"
                      >
                        <img
                          src={allPhotos[selectedPhotoIndex].photoBase64}
                          alt="Before"
                          className="w-full rounded-xl border-2 border-white/20 group-hover:border-white/40 transition-all"
                        />
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
                          Before
                        </div>
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-xl transition-all flex items-center justify-center">
                          <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                            Tap to enlarge
                          </span>
                        </div>
                      </button>
                      {/* After */}
                      <button
                        onClick={() => {
                          setFullscreenImage(allPhotos[selectedPhotoIndex].enhancedBase64!);
                          setFullscreenImageType("after");
                        }}
                        className="relative group cursor-pointer"
                      >
                        <img
                          src={allPhotos[selectedPhotoIndex].enhancedBase64}
                          alt="After (Expected)"
                          className="w-full rounded-xl border-2 border-green-500 group-hover:border-green-400 transition-all"
                        />
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
                          After
                        </div>
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-xl transition-all flex items-center justify-center">
                          <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                            Tap to enlarge
                          </span>
                        </div>
                      </button>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-sm text-white/80">
                        ✨ Expected results after using recommended products
                      </p>
                    </div>
                  </div>
                ) : (
                  // Show only original photo
                  <button
                    onClick={() => setFullscreenImage(allPhotos[selectedPhotoIndex].photoBase64)}
                    className="w-full max-w-2xl mx-auto group cursor-pointer"
                  >
                    <img
                      src={allPhotos[selectedPhotoIndex].photoBase64}
                      alt="Photo detail"
                      className="w-full rounded-xl group-hover:opacity-90 transition-opacity"
                    />
                  </button>
                )}
              </div>

              {/* Analysis Card */}
              {allPhotos[selectedPhotoIndex]?.analysis ? (
                <Card className="max-w-2xl mx-auto bg-white">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">AI Skin Analysis</h3>
                        <p className="text-sm text-gray-600">
                          Score: {Math.round(allPhotos[selectedPhotoIndex].analysis?.overallScore || 0)}/100
                        </p>
                      </div>
                    </div>

                    {allPhotos[selectedPhotoIndex].analysis?.problems?.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {allPhotos[selectedPhotoIndex].analysis.problems.map((problem: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 bg-purple-50 p-3 rounded-lg border border-purple-100">
                            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                            <span className="text-sm text-gray-700 capitalize font-medium">
                              {problem.type.replace('_', ' ')}: {Math.round(problem.severity)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center mb-4">
                        <p className="text-green-700 font-semibold">✨ Great! No major issues detected</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(allPhotos[selectedPhotoIndex].date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="max-w-2xl mx-auto bg-white">
                  <div className="p-6 text-center">
                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
                    <p className="text-gray-600">No analysis available for this photo yet</p>
                  </div>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex gap-3 max-w-2xl mx-auto mt-4">
                <Button
                  onClick={() => setSelectedPhotoIndex(Math.max(0, selectedPhotoIndex - 1))}
                  disabled={selectedPhotoIndex === 0}
                  variant="outline"
                  className="flex-1 py-6 border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold disabled:opacity-50"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={() => setSelectedPhotoIndex(Math.min(allPhotos.length - 1, selectedPhotoIndex + 1))}
                  disabled={selectedPhotoIndex === allPhotos.length - 1}
                  variant="outline"
                  className="flex-1 py-6 border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold disabled:opacity-50"
                >
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Image Modal */}
        {fullscreenImage && selectedPhotoIndex !== null && (
          <div
            className="fixed inset-0 bg-black z-[60] flex flex-col items-center justify-center p-4"
            onClick={() => {
              setFullscreenImage(null);
              setFullscreenImageType(null);
            }}
            onTouchStart={(e) => {
              setTouchEnd(null);
              setTouchStart(e.targetTouches[0].clientX);
            }}
            onTouchMove={(e) => {
              setTouchEnd(e.targetTouches[0].clientX);
            }}
            onTouchEnd={() => {
              if (!touchStart || !touchEnd) return;
              if (!allPhotos[selectedPhotoIndex].enhancedBase64) return; // Pas de swipe si pas d'enhanced

              const distance = touchStart - touchEnd;
              const isLeftSwipe = distance > minSwipeDistance;
              const isRightSwipe = distance < -minSwipeDistance;

              if (isLeftSwipe && fullscreenImageType === "before") {
                // Swipe left sur Before → Afficher After
                setFullscreenImage(allPhotos[selectedPhotoIndex].enhancedBase64!);
                setFullscreenImageType("after");
              } else if (isRightSwipe && fullscreenImageType === "after") {
                // Swipe right sur After → Afficher Before
                setFullscreenImage(allPhotos[selectedPhotoIndex].photoBase64);
                setFullscreenImageType("before");
              }
            }}
          >
            <button
              onClick={() => {
                setFullscreenImage(null);
                setFullscreenImageType(null);
              }}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Badge Before/After */}
            {fullscreenImageType && allPhotos[selectedPhotoIndex].enhancedBase64 && (
              <div className="absolute top-4 left-4 z-10">
                <div className={`${fullscreenImageType === "before" ? "bg-red-500" : "bg-green-500"} text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg`}>
                  {fullscreenImageType === "before" ? "Before" : "After"}
                </div>
              </div>
            )}

            {/* Toggle detection boxes button (only on Before) */}
            {fullscreenImageType === "before" && allPhotos[selectedPhotoIndex].analysis?.problems?.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetectionBoxes(!showDetectionBoxes);
                }}
                className="absolute top-20 left-4 bg-white/20 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full font-semibold hover:bg-white/30 transition-all z-10"
              >
                {showDetectionBoxes ? "Hide detections" : "Show detections"}
              </button>
            )}

            {/* Instruction de swipe */}
            {fullscreenImageType && allPhotos[selectedPhotoIndex].enhancedBase64 && (
              <div className="absolute bottom-20 left-0 right-0 flex items-center justify-center z-10">
                <div className="bg-white/20 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full">
                  {fullscreenImageType === "before" ? "← Swipe left for After" : "Swipe right for Before →"}
                </div>
              </div>
            )}

            <div className="relative max-w-full max-h-full flex items-center justify-center">
              <img
                src={fullscreenImage}
                alt="Fullscreen view"
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              {/* Detection boxes overlay (only on Before when enabled) */}
              {fullscreenImageType === "before" && showDetectionBoxes && allPhotos[selectedPhotoIndex].analysis?.problems?.map((problem: any, idx: number) => (
                <div
                  key={idx}
                  className="absolute border-2 border-red-500 rounded pointer-events-none"
                  style={{
                    left: `${problem.location.x}%`,
                    top: `${problem.location.y}%`,
                    width: `${problem.location.width}%`,
                    height: `${problem.location.height}%`,
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap font-semibold">
                    {problem.type.replace('_', ' ')}: {Math.round(problem.severity)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
