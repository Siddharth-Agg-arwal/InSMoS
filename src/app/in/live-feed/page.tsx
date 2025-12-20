"use client";

import { LiveMonitoring } from "@/components/live-monitoring-table";
import SearchBar from "@/components/search-bar";
import { SquareCard } from "@/components/ui/square-card";
import { Activity, Camera, Cpu, HeartPulse, Users, OctagonAlert, SquareAsterisk, ScanHeart } from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';

interface Patient {
    id: number;
    name: string;
    age: number;
    status: string;
    doctor_id: number;
}

export default function LiveFeed() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        critical: 0,
        atRisk: 0,
        healthy: 0
    });

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/v1/patients/`);
                if (response.ok) {
                    const data = await response.json();
                    setPatients(data);
                    
                    // Calculate statistics
                    const critical = data.filter((p: Patient) => 
                        p.status === "Severe" || p.status === "Critical"
                    ).length;
                    const atRisk = data.filter((p: Patient) => 
                        p.status === "Moderate" || p.status === "At Risk"
                    ).length;
                    const healthy = data.filter((p: Patient) => 
                        p.status === "Good" || p.status === "Stable"
                    ).length;
                    
                    setStats({
                        total: data.length,
                        critical,
                        atRisk,
                        healthy
                    });
                }
            } catch (error) {
                console.error("Error fetching patients:", error);
                // Use default values if fetch fails
                setStats({
                    total: 128,
                    critical: 12,
                    atRisk: 87,
                    healthy: 76
                });
            }
        };

        fetchPatients();
        // Refresh stats every 30 seconds
        const interval = setInterval(fetchPatients, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            <main
                className="pt-8 pr-24 pb-8 w-full"
                style={{ width: "calc(100vw - 17rem)" }}
            >
                <div className="pl-20 grid grid-cols-1 gap-6 md:grid-cols-4">
                    <SquareCard
                        icon={<Users className="h-8 w-8" />}
                        iconClassName="text-black"
                        title="Total Patients"
                        value={stats.total}
                        description="Number of patients being monitored"
                        bgColor="bg-[#D6D7F5]"
                    />
                    <SquareCard
                        icon={<OctagonAlert className="h-8 w-8" />}
                        iconClassName="text-black"
                        title="Critical Patients"
                        value={stats.critical}
                        description="Patients in critical condition."
                        bgColor="bg-[#FF9593]"
                    />
                    <SquareCard
                        icon={<SquareAsterisk className="h-8 w-8" />}
                        iconClassName="text-black"
                        title="At Alert Patients"
                        value={stats.atRisk}
                        description="Patients at risk of complications."
                        bgColor="bg-[#FDFD77]"
                    />
                    <SquareCard
                        icon={<ScanHeart className="h-8 w-8" />}
                        iconClassName="text-black"
                        title="Healthy Patients"
                        value={stats.healthy}
                        description="Patients with stable health."
                        bgColor="bg-[#D6E4E5]"
                    />
                </div>
                <div className="ml-20 mt-8 bg-white rounded-xl p-6">
                    <LiveMonitoring />
                </div>
            </main>
        </div>
    );
}