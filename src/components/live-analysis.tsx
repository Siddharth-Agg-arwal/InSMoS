"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, Activity, TrendingUp, Zap, AlertTriangle, CheckCircle } from "lucide-react";

interface LiveAnalysisProps {
  eegData: number[];
  patientStatus: string;
}

export function LiveAnalysis({ eegData, patientStatus }: LiveAnalysisProps) {
  // Calculate statistics from EEG data
  const calculateStats = () => {
    if (eegData.length === 0) {
      return { mean: 0, max: 0, min: 0, stdDev: 0, variance: 0 };
    }

    const mean = eegData.reduce((a, b) => a + b, 0) / eegData.length;
    const max = Math.max(...eegData);
    const min = Math.min(...eegData);
    const variance = eegData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / eegData.length;
    const stdDev = Math.sqrt(variance);

    return { mean, max, min, stdDev, variance };
  };

  const stats = calculateStats();

  // Simple seizure detection based on voltage spikes and variance
  const detectSeizure = () => {
    if (eegData.length < 10) return false;
    
    // Check for abnormal spikes (simplified)
    const recentData = eegData.slice(-20);
    const recentMean = recentData.reduce((a, b) => a + b, 0) / recentData.length;
    const recentMax = Math.max(...recentData);
    const recentMin = Math.min(...recentData);
    
    // Detect if recent activity shows large spikes (simplified logic)
    const spikeThreshold = Math.abs(recentMean) * 2.5;
    const hasSpike = Math.abs(recentMax) > spikeThreshold || Math.abs(recentMin) > spikeThreshold;
    
    // High variance can indicate seizure
    const highVariance = stats.stdDev > 50;
    
    return hasSpike || highVariance;
  };

  const seizureDetected = detectSeizure();
  const riskLevel = seizureDetected ? "Critical" : stats.stdDev > 30 ? "Moderate" : "Good";

  return (
    <div className="space-y-6 w-full">
      {/* Seizure Detection Alert */}
      <Card 
        className={`border-2 ${
          seizureDetected 
            ? "border-red-500 bg-red-50" 
            : riskLevel === "Moderate" 
            ? "border-yellow-500 bg-yellow-50" 
            : "border-green-500 bg-green-50"
        }`}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {seizureDetected ? (
                <>
                  <AlertCircle className="h-6 w-6 text-red-600 animate-pulse" />
                  <span className="text-red-600">Seizure Alert</span>
                </>
              ) : riskLevel === "Moderate" ? (
                <>
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  <span className="text-yellow-600">Moderate Risk</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-green-600">Normal Activity</span>
                </>
              )}
            </span>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
              seizureDetected 
                ? "bg-red-200 text-red-700" 
                : riskLevel === "Moderate" 
                ? "bg-yellow-200 text-yellow-700" 
                : "bg-green-200 text-green-700"
            }`}>
              {riskLevel}
            </span>
          </CardTitle>
          <CardDescription className={
            seizureDetected 
              ? "text-red-600" 
              : riskLevel === "Moderate" 
              ? "text-yellow-600" 
              : "text-green-600"
          }>
            {seizureDetected 
              ? "Abnormal EEG patterns detected. Immediate attention required." 
              : riskLevel === "Moderate"
              ? "Elevated EEG activity detected. Continue monitoring."
              : "EEG patterns are within normal range."}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Live Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time EEG Statistics
          </CardTitle>
          <CardDescription>
            Live analysis of EEG signal characteristics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Mean Voltage</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.mean.toFixed(2)} μV</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Std Deviation</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{stats.stdDev.toFixed(2)} μV</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Variance</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.variance.toFixed(2)}</p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-gray-600">Max Voltage</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.max.toFixed(2)} μV</p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-medium text-gray-600">Min Voltage</span>
              </div>
              <p className="text-2xl font-bold text-indigo-600">{stats.min.toFixed(2)} μV</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-600">Data Points</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{eegData.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Signal Quality */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Signal Quality Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Signal Stability</span>
                <span className="text-sm text-gray-600">
                  {stats.stdDev < 20 ? "Excellent" : stats.stdDev < 40 ? "Good" : "Poor"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    stats.stdDev < 20 ? "bg-green-500" : stats.stdDev < 40 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(100, (100 - stats.stdDev))}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Data Collection Rate</span>
                <span className="text-sm text-gray-600">
                  {eegData.length > 50 ? "Optimal" : "Collecting..."}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (eegData.length / 60) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
