"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
IconArrowWaveRightUp,
IconBoxAlignRightFilled,
IconBoxAlignTopLeft,
IconClipboardCopy,
IconFileBroken,
IconSignature,
IconTableColumn,
} from "@tabler/icons-react";
import { SeizureFrequencyBarChart } from "./seizure-frequency-bar-chart";
import { UptimeLineChart } from "./uptime-line-chart";
import StatValue from "./stat-values";
import { HeighestSeizures } from "./highest-seizures";
import { MostRecentSeizures } from "./most-recent-seizures";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';

interface Patient {
    id: number;
    name: string;
    age: number;
    status: string;
    doctor_id: number;
}

export function BentoGridDemo() {
    const [stats, setStats] = useState({
        totalPatients: 0,
        atRiskPatients: 0,
        seizuresDetected: 0,
    });

    useEffect(() => {
        async function fetchStats() {
            try {
                // Fetch patients
                const patientsRes = await fetch(`${API_BASE}/api/v1/patients/`);
                let totalPatients = 0;
                let criticalPatients = 0;
                let atAlertPatients = 0;

                if (patientsRes.ok) {
                    const patients: Patient[] = await patientsRes.json();
                    totalPatients = patients.length;
                    
                    // Critical patients: Severe or Critical status
                    criticalPatients = patients.filter(p => 
                        p.status === "Severe" || p.status === "Critical"
                    ).length;
                    
                    // At alert patients: Moderate or At Risk status
                    atAlertPatients = patients.filter(p => 
                        p.status === "Moderate" || p.status === "At Risk"
                    ).length;
                }

                // Fetch seizures count from notable_sessions (last 24h)
                const sessionsRes = await fetch(`${API_BASE}/api/v1/sessions/count/last24h`);
                let seizuresDetected = 0;
                if (sessionsRes.ok) {
                    const sessionData = await sessionsRes.json();
                    seizuresDetected = sessionData.count || 0;
                }

                setStats({
                    totalPatients,
                    atRiskPatients: criticalPatients + atAlertPatients,
                    seizuresDetected,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        }

        fetchStats();
        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const items = [
        {
            title: "Total Number of Patients",
            description: "Number of patients being monitored live now.",
            header: <StatValue value={stats.totalPatients} />,
            icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
            className: "bg-[#D6D7F5]"
        },
        {
            title: "At Risk Patients",
            description: "Patients who are experiencing seizures actively",
            header: <StatValue value={stats.atRiskPatients} />,
            icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
            className: "bg-[#D6E4E5]"
        },
        {
            title: "Seizures Detected",
            description: "Number of seizures detected in the last 24 hours.",
            header: <StatValue value={stats.seizuresDetected} />,
            icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
            className: "bg-[#FDFD77]"
        },
        {
            title: "Average Seizure Frequency",
            description: "Daily frequency of seizures being detected.",
            header: <SeizureFrequencyBarChart />,
            icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
            className: "bg-white"
        },
        {
            title: "System Uptime",
            description: "Uninterrupted service.",
            header: <UptimeLineChart />,
            icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
            className: "bg-[#D6E4E5]"
        },
        {
            title: "Flagged Patients",
            description: "Patients with highest seizure frequency.",
            header: <HeighestSeizures />,
            icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
            className: "bg-[#D6D7F5]"
        },
        {
            title: "Most Recent Seizure Patients",
            description: "Patients who had seizures most recently.",
            header: <MostRecentSeizures />,
            icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
            className: "bg-white"
        },
    ];

    return (
        <BentoGrid className="max-w-5xl mx-auto">
            {items.map((item, i) => (
                <BentoGridItem
                    key={i}
                    title={item.title}
                    description={item.description}
                    header={item.header}
                    icon={item.icon}
                    className={cn(item.className, i === 3 || i === 6 ? "md:col-span-2" : "")}
                />
            ))}
        </BentoGrid>
    );
}
