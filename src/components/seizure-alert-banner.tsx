"use client";

import { useEffect, useState } from "react";
import { AlertCircle, X, Bell } from "lucide-react";
import { Button } from "./ui/button";

interface SeizureAlert {
  patientId: number;
  patientName: string;
  timestamp: string;
  id: string;
}

interface SeizureAlertBannerProps {
  alerts: SeizureAlert[];
  onDismiss: (id: string) => void;
}

export function SeizureAlertBanner({ alerts, onDismiss }: SeizureAlertBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(alerts.length > 0);
  }, [alerts]);

  if (!visible || alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-red-600 text-white p-4 rounded-lg shadow-2xl border-2 border-red-700 animate-in slide-in-from-right"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 animate-pulse flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-lg">Seizure Detected!</p>
                <p className="text-sm mt-1">
                  Patient: <span className="font-semibold">{alert.patientName}</span>
                </p>
                <p className="text-xs mt-1 opacity-90">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
                <p className="text-xs mt-2 bg-red-700 px-2 py-1 rounded inline-block">
                  🤖 ML Model Detection
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-red-700"
              onClick={() => onDismiss(alert.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              className="bg-white text-red-600 hover:bg-red-50 text-xs"
              onClick={() => {
                // Navigate to patient page
                window.location.href = `/in/live-feed?patient=${alert.patientId}`;
              }}
            >
              View Patient
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-white border-white hover:bg-red-700 text-xs"
              onClick={() => onDismiss(alert.id)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Hook to manage seizure alerts
export function useSeizureAlerts() {
  const [alerts, setAlerts] = useState<SeizureAlert[]>([]);

  const addAlert = (alert: Omit<SeizureAlert, "id">) => {
    const newAlert: SeizureAlert = {
      ...alert,
      id: `${alert.patientId}-${Date.now()}`,
    };
    
    setAlerts((prev) => [...prev, newAlert]);

    // Auto-dismiss after 30 seconds
    setTimeout(() => {
      dismissAlert(newAlert.id);
    }, 30000);

    // Play notification sound (optional)
    try {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {
        // Ignore if audio playback fails
      });
    } catch (e) {
      // Ignore audio errors
    }
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const dismissAll = () => {
    setAlerts([]);
  };

  return { alerts, addAlert, dismissAlert, dismissAll };
}
