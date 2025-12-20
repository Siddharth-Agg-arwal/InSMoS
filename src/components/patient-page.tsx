"use client";

import { Button } from "@/components/ui/button";
import { X, BrainCircuit, ActivitySquare, Syringe, User, CalendarCheck2, ShieldCheck, Droplets, Pill, Users, Phone } from "lucide-react";
import { EEGChart } from "./eeg-chart";
import { LiveAnalysis } from "./live-analysis";
import { useWebSocket } from "@/hooks/use-websocket";
import { useMemo } from "react";

export function PatientPage({
  patientId,
  onClose,
  patients,
}: {
  patientId: number;
  onClose: () => void;
  patients: any[];
}) {
  const patient = patients.find((p) => p.id === patientId);
  const { data: wsData } = useWebSocket(patientId, true);
  
  // Use useMemo to calculate values only when wsData actually changes
  const eegValues = useMemo(() => {
    const fiveSecondsAgo = Date.now() - (5 * 1000);
    return wsData
      .filter(d => new Date(d.timestamp).getTime() > fiveSecondsAgo)
      .flatMap(d => d.channel_data && d.channel_data.length > 0 ? [d.channel_data[0]] : []);
  }, [wsData]);

  if (!patient) return null;

  // Example fallback values for demonstration
  const {
    patient: name,
    age,
    status,
    condition = "Epilepsy",
    bloodType = "O+",
    seizureFrequency = "2/month",
    medication = "Levetiracetam",
    guardian = "John Doe",
    contact = "+1 234 567 8901",
  } = patient;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col h-screen w-screen">
      {/* Top bar with close */}
      <div className="flex items-center p-6 border-b border-gray-200">
        <button
          className="flex items-center gap-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
          <span className="font-medium">Close</span>
        </button>
      </div>
      {/* Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left section: Patient Details (fixed width, sticky) */}
        <div
          className="w-full max-w-lg p-10 border-r border-gray-200 flex flex-col gap-8 flex-shrink-0"
          style={{ position: "sticky", left: 0, top: 0, alignSelf: "flex-start", height: "calc(100vh - 81px)" }}
        >
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <User className="h-6 w-6 text-gray-500" />
              Patient Details
            </h2>
            <div className="space-y-4 text-base">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <span className="font-semibold w-36 inline-block">Name:</span>
                <span>{name}</span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarCheck2 className="h-5 w-5 text-gray-400" />
                <span className="font-semibold w-36 inline-block">Age:</span>
                <span>{age}</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-gray-400" />
                <span className="font-semibold w-36 inline-block">Status:</span>
                <span>{status}</span>
              </div>
              <div className="flex items-center gap-3">
                <BrainCircuit className="h-5 w-5 text-gray-400" />
                <span className="font-semibold w-36 inline-block">Condition:</span>
                <span>{condition}</span>
              </div>
              <div className="flex items-center gap-3">
                <Droplets className="h-5 w-5 text-gray-400" />
                <span className="font-semibold w-36 inline-block">Blood Type:</span>
                <span>{bloodType}</span>
              </div>
              <div className="flex items-center gap-3">
                <ActivitySquare className="h-5 w-5 text-gray-400" />
                <span className="font-semibold w-36 inline-block">Seizure Frequency:</span>
                <span>{seizureFrequency}</span>
              </div>
              <div className="flex items-center gap-3">
                <Pill className="h-5 w-5 text-gray-400" />
                <span className="font-semibold w-36 inline-block">Medication:</span>
                <span>{medication}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="font-semibold w-36 inline-block">Guardian:</span>
                <span>{guardian}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="font-semibold w-36 inline-block">Contact:</span>
                <span>{contact}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Right section: EEG Chart and Live Analysis with scroll */}
        <div className="flex-1 p-10 flex flex-col gap-8 items-center justify-start bg-gray-50 overflow-y-auto min-h-0">
          <div className="w-full">
            <div className="flex items-center gap-2 mb-4">
              <BrainCircuit className="h-6 w-6 text-green-400" />
              <span className="text-lg font-semibold text-green-700">Live EEG Monitoring</span>
            </div>
            <EEGChart patientId={patientId} />
          </div>
          
          <div className="w-full">
            <div className="flex items-center gap-2 mb-4">
              <ActivitySquare className="h-6 w-6 text-purple-400" />
              <span className="text-lg font-semibold text-purple-700">Real-Time Analysis</span>
            </div>
            <LiveAnalysis eegData={eegValues} patientStatus={status} />
          </div>
        </div>
      </div>
    </div>
  );
}