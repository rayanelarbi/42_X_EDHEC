"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Camera, Image as ImageIcon, Calendar, Plus, Trash2 } from "lucide-react";

export default function PhotosPage() {
  const router = useRouter();
  const photos = useAppStore((state) => state.photos);
  const photoBase64 = useAppStore((state) => state.photoBase64);
  const addPhotoToHistory = useAppStore((state) => state.addPhotoToHistory);

  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  // Ajouter la photo initiale si elle existe et n'est pas déjà dans l'historique
  const allPhotos = photoBase64 && photos.length === 0
    ? [{ date: new Date().toISOString(), photoBase64, note: "Initial photo" }]
    : photos;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getDaysSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
              <ImageIcon className="w-5 h-5 text-[#0065B7]" />
              <span className="font-bold text-xl tracking-tight text-gray-900">
                My Photos
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Your progress
          </h1>
          <p className="text-lg text-gray-600">
            Track your skin's evolution over time
          </p>
        </div>

        {/* Ajouter une photo */}
        <Card className="mb-8 p-6 border-2 border-dashed border-[#0065B7] bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
          <button
            onClick={() => router.push("/camera")}
            className="w-full flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-[#0065B7] to-[#0088cc] rounded-full flex items-center justify-center shadow-lg">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Add a new photo
              </h3>
              <p className="text-sm text-gray-600">
                Document your progress to see results
              </p>
            </div>
          </button>
        </Card>

        {/* Timeline des photos */}
        {allPhotos.length === 0 ? (
          <Card className="p-12 text-center border-2 border-gray-200">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No photos yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start documenting your progress by adding your first photo
            </p>
            <Button
              onClick={() => router.push("/camera")}
              className="bg-[#0065B7] hover:bg-[#004a8a] text-white"
            >
              <Camera className="mr-2 w-4 h-4" />
              Take a photo
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {allPhotos.map((photo, index) => (
              <Card key={index} className="overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="grid md:grid-cols-2 gap-6 p-6">
                  {/* Photo */}
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedPhoto(selectedPhoto === index ? null : index)}
                  >
                    <img
                      src={photo.photoBase64}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-80 object-cover rounded-xl border-2 border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-xl flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                        Click to enlarge
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-[#0065B7]" />
                        <h3 className="text-xl font-bold text-gray-900">
                          {formatDate(photo.date)}
                        </h3>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <span className="text-sm font-semibold text-gray-700">
                            Days ago
                          </span>
                          <span className="text-lg font-bold text-[#0065B7]">
                            {getDaysSince(photo.date)} days
                          </span>
                        </div>

                        {index === 0 && (
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm font-semibold text-green-800 text-center">
                              📸 Reference photo
                            </p>
                          </div>
                        )}

                        {photo.note && (
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-700 italic">"{photo.note}"</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {index > 0 && (
                      <Button
                        variant="outline"
                        className="border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500"
                      >
                        <Trash2 className="mr-2 w-4 h-4" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Comparaison avant/après */}
        {allPhotos.length >= 2 && (
          <Card className="mt-8 p-6 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Before/after comparison
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2 text-center">
                  First photo
                </p>
                <img
                  src={allPhotos[0].photoBase64}
                  alt="Avant"
                  className="w-full h-80 object-cover rounded-xl border-2 border-purple-300"
                />
                <p className="text-xs text-gray-600 mt-2 text-center">{formatDate(allPhotos[0].date)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2 text-center">
                  Most recent photo
                </p>
                <img
                  src={allPhotos[allPhotos.length - 1].photoBase64}
                  alt="Après"
                  className="w-full h-80 object-cover rounded-xl border-2 border-purple-300"
                />
                <p className="text-xs text-gray-600 mt-2 text-center">{formatDate(allPhotos[allPhotos.length - 1].date)}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Modal photo plein écran */}
      {selectedPhoto !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={allPhotos[selectedPhoto].photoBase64}
            alt="Photo en grand"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
