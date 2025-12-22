"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, Activity, TrendingUp, Zap, AlertTriangle, CheckCircle } from "lucide-react";

interface LiveAnalysisProps {
  eegData: number[];
  patientStatus: string;
  seizureDetected?: boolean;
  mlDetection?: boolean;
}

export function LiveAnalysis({ eegData, patientStatus, seizureDetected: seizureDetectedProp, mlDetection }: LiveAnalysisProps) {
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

  // Use ML-based detection from backend if available, otherwise fall back to frontend detection
  const seizureDetected = seizureDetectedProp !== undefined ? seizureDetectedProp : (mlDetection !== undefined ? mlDetection : detectSeizure());
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
              ? "Immediate attention required! Seizure activity detected by ML model." 
              : riskLevel === "Moderate" 
              ? "Elevated brain activity detected. Continue monitoring." 
              : "Brain activity within normal parameters."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Real-time Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Mean Voltage</p>
                <p className="text-2xl font-bold">{stats.mean.toFixed(2)} μV</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Std Deviation</p>
                <p className="text-2xl font-bold">{stats.stdDev.toFixed(2)} μV</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Max Amplitude</p>
                <p className="text-2xl font-bold">{stats.max.toFixed(2)} μV</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Min Amplitude</p>
                <p className="text-2xl font-bold">{stats.min.toFixed(2)} μV</p>
              </div>
            </div>

            {/* Detection Info */}
            {/* Seizure Alert Banner */}
            {seizureDetected && (
              <div className="mt-4 p-4 bg-red-100 border-2 border-red-500 rounded-lg animate-pulse">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-sm font-bold text-red-900">SEIZURE DETECTED</p>
                </div>
                <p className="text-xs text-red-700 mt-1">
                  Abnormal neural activity detected. Notify medical staff immediately.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              Variance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.variance.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Signal variability</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Range
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{(stats.max - stats.min).toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Peak-to-peak amplitude</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              Sample Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{eegData.length}</p>
            <p className="text-xs text-gray-500 mt-1">Active data points</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
