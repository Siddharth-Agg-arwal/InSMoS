"use client";

import { useEffect, useRef, useState } from "react";

interface EEGDataMessage {
  patient_id: number;
  timestamp: string;
  channel_data: number[];
  seizure_detected?: boolean;
  voltage?: number[];
}

export function useWebSocket(patientId: number | null, enabled: boolean = true) {
  const [data, setData] = useState<EEGDataMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const bufferRef = useRef<EEGDataMessage[]>([]);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || patientId === null) {
      return;
    }

    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000; // 3 seconds
    const updateFrequency = 50; // Update UI every 50ms (20 FPS) instead of 256 times per second

    const connect = () => {
      // Updated URL to match backend router: /api/v1/ws/live_eeg/{patient_id}
      const wsUrl = `ws://localhost:8000/api/v1/ws/live_eeg/${patientId}`;
      
      try {
        console.log(`Attempting to connect to: ${wsUrl}`);
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log(`✅ WebSocket connected for patient ${patientId}`);
          setIsConnected(true);
          setError(null);
          reconnectAttemptsRef.current = 0;

          // Start periodic UI updates
          updateIntervalRef.current = setInterval(() => {
            if (bufferRef.current.length > 0) {
              setData((prev) => {
                const combined = [...prev, ...bufferRef.current];
                bufferRef.current = []; // Clear buffer
                
                // Keep only last 5 seconds of data
                const fiveSecondsAgo = Date.now() - (5 * 1000);
                return combined.filter(d => {
                  const msgTime = new Date(d.timestamp).getTime();
                  return msgTime > fiveSecondsAgo;
                });
              });
            }
          }, updateFrequency);
        };

        ws.onmessage = (event) => {
          try {
            const message: EEGDataMessage = JSON.parse(event.data);
            // Buffer messages instead of updating state immediately
            bufferRef.current.push(message);
          } catch (err) {
            console.error("❌ Error parsing WebSocket message:", err);
          }
        };

        ws.onerror = (event) => {
          console.error("❌ WebSocket error:", event);
          setError("WebSocket connection error - Check if backend is running");
          setIsConnected(false);
        };

        ws.onclose = (event) => {
          console.log(`🔌 WebSocket closed (Code: ${event.code}, Reason: ${event.reason || 'No reason'})`);
          setIsConnected(false);

          // Clear update interval
          if (updateIntervalRef.current) {
            clearInterval(updateIntervalRef.current);
            updateIntervalRef.current = null;
          }

          // Attempt to reconnect if not manually closed
          if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current++;
            console.log(`🔄 Reconnecting... (Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
            setError(`Reconnecting... (Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, reconnectDelay);
          } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            setError("Failed to connect after multiple attempts. Check if backend and MQTT are running.");
            console.error("❌ Max reconnection attempts reached");
          }
        };

      } catch (err) {
        console.error("❌ Error creating WebSocket:", err);
        setError("Failed to create WebSocket connection");
      }
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounted");
      }
      bufferRef.current = []; // Clear buffer
    };
  }, [patientId, enabled]);

  const clearData = () => setData([]);

  return { data, isConnected, error, clearData };
}
