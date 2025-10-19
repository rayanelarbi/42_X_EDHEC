"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, CheckCircle } from "lucide-react";

export default function CreditsPage() {
  const [credits, setCredits] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/check-credits');
      const data = await response.json();

      if (data.success) {
        setCredits(data.credits);
      } else {
        setError(data.error || 'Failed to fetch credits');
      }
    } catch (err) {
      setError('Network error: ' + String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>AILabTools API Credits</span>
              <Button
                onClick={fetchCredits}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-semibold text-red-800">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {loading && !credits && (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            )}

            {credits && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="font-semibold text-green-800">API Connection OK</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Current Balance</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {credits.data?.balance !== undefined
                            ? credits.data.balance.toLocaleString()
                            : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">credits</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Total Credits</p>
                        <p className="text-3xl font-bold text-purple-600">
                          {credits.data?.total_balance !== undefined
                            ? credits.data.total_balance.toLocaleString()
                            : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">total</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Full Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-xs">
                      {JSON.stringify(credits, null, 2)}
                    </pre>
                  </CardContent>
                </Card>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">API Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>API Key:</strong> {process.env.NEXT_PUBLIC_SHOW_API_KEY ? process.env.AILABTOOLS_API_KEY : '••••••••••••••••'}</p>
                    <p><strong>Endpoint:</strong> https://www.ailabapi.com/api/common/query-balance</p>
                    <p><strong>Status:</strong> {credits.code === 0 ? '✅ Active' : '⚠️ Check response'}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
