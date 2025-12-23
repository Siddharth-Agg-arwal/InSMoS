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
  const seizureDetectedRef = useRef(false);
  const currentFrequencyRef = useRef(2000); // Track current frequency
  const lastUpdateRef = useRef(Date.now()); // Track last update time
  const isProcessingRef = useRef(false); // Prevent concurrent processing

  useEffect(() => {
    if (!enabled || patientId === null) {
      return;
    }

    const maxReconnectAttempts = 10;
    const reconnectDelay = 2000; // 2 seconds
    const normalUpdateFrequency = 2000; // 2 seconds when normal
    const alertUpdateFrequency = 1000; // 1 second when seizure detected

    const processBuffer = () => {
      // Prevent concurrent processing
      if (isProcessingRef.current) {
        console.log('⏸️ Already processing, skipping...');
        return;
      }
      
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateRef.current;
      
      // Prevent updates that are too frequent
      if (timeSinceLastUpdate < currentFrequencyRef.current - 100) {
        console.log('⏱️ Too soon since last update, skipping...');
        return;
      }
      
      console.log('🔄 Processing buffer. Buffer size:', bufferRef.current.length);
      
      if (bufferRef.current.length > 0) {
        isProcessingRef.current = true;
        lastUpdateRef.current = now;
        
        try {
          setData((prev) => {
            // Take small batch to avoid overwhelming the UI
            const batchSize = seizureDetectedRef.current ? 5 : 3;
            const dataToAdd = bufferRef.current.slice(0, batchSize);
            bufferRef.current = bufferRef.current.slice(batchSize);
            
            console.log('➕ Adding to data:', dataToAdd.length, 'items');
            console.log('📅 Sample timestamp:', dataToAdd[0]?.timestamp);
            
            const combined = [...prev, ...dataToAdd];
            
            // Keep last 100 items instead of time-based filtering to avoid timezone issues
            const sorted = combined.sort((a, b) => {
              return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            });
            const filtered = sorted.slice(0, 100);
            
            console.log('📊 Total data points:', filtered.length, '(from', combined.length, 'combined)');
            
            return filtered;
          });
        } finally {
          isProcessingRef.current = false;
        }
      } else {
        console.log('📭 Buffer empty, nothing to process');
      }
      
      // Check if frequency needs to change
      const desiredFrequency = seizureDetectedRef.current ? alertUpdateFrequency : normalUpdateFrequency;
      if (desiredFrequency !== currentFrequencyRef.current) {
        currentFrequencyRef.current = desiredFrequency;
        console.log('⚡ Changing update frequency to:', desiredFrequency);
        startUpdateInterval();
      }
    };

    const startUpdateInterval = () => {
      // Clear existing interval
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      
      // Start new interval with current frequency
      updateIntervalRef.current = setInterval(processBuffer, currentFrequencyRef.current);
    };

    const connect = () => {
      // Updated URL to match backend router: /api/v1/ws/live_eeg/{patient_id}
      const wsUrl = `ws://localhost:8000/api/v1/ws/live_eeg/${patientId}`;
      
      try {
        console.log(`Attempting to connect to: ${wsUrl}`);
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log(`✅ WebSocket connected for patient ${patientId}`);
          console.log(`📡 WebSocket URL: ws://localhost:8000/api/v1/ws/live_eeg/${patientId}`);
          setIsConnected(true);
          setError(null);
          reconnectAttemptsRef.current = 0;

          // Start periodic UI updates
          startUpdateInterval();
        };

        ws.onmessage = (event) => {
          console.log('📩 RAW WebSocket message received:', event.data);
          try {
            const message: EEGDataMessage = JSON.parse(event.data);
            console.log('✅ Parsed message:', message);
            
            // Update seizure detection status
            if (message.seizure_detected !== undefined) {
              seizureDetectedRef.current = message.seizure_detected;
              console.log('🚨 Seizure status:', message.seizure_detected);
            }
            
            // Limit buffer size to prevent memory issues
            const maxBufferSize = 50;
            if (bufferRef.current.length < maxBufferSize) {
              bufferRef.current.push(message);
              console.log('📦 Added to buffer. Buffer size:', bufferRef.current.length);
            } else {
              // If buffer is getting full, skip some messages to prevent overflow
              if (bufferRef.current.length % 2 === 0) {
                bufferRef.current.shift();
                bufferRef.current.push(message);
                console.log('♻️ Buffer full, replaced oldest. Buffer size:', bufferRef.current.length);
              } else {
                console.log('⚠️ Buffer full, message skipped');
              }
            }
          } catch (err) {
            console.error("❌ Error parsing WebSocket message:", err);
          }
        };

        ws.onerror = (event) => {
          // Suppress error logging to console, just update state
          setError("WebSocket connection issue - Reconnecting...");
          setIsConnected(false);
        };

        ws.onclose = (event) => {
          setIsConnected(false);

          // Clear update interval
          if (updateIntervalRef.current) {
            clearInterval(updateIntervalRef.current);
            updateIntervalRef.current = null;
          }

          // Attempt to reconnect if not manually closed
          if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current++;
            setError(`Reconnecting... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, reconnectDelay);
          } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            setError("Connection lost. Please refresh the page.");
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
