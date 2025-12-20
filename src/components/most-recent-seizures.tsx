"use client"

import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Loader2 } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';

interface RecentSeizure {
    session_id: number;
    patient_id: number;
    name: string;
    time: string | null;
}

function formatTime(isoString: string | null): string {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function formatRelativeTime(isoString: string | null): string {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatTime(isoString);
}

export function MostRecentSeizures() {
    const [seizures, setSeizures] = useState<RecentSeizure[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${API_BASE}/api/v1/sessions/recent?limit=4`);
                if (res.ok) {
                    const data = await res.json();
                    setSeizures(data);
                }
            } catch (error) {
                console.error("Error fetching recent seizures:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead className="text-right">Time</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {seizures.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={2} className="text-center text-gray-400">
                        No data available
                    </TableCell>
                </TableRow>
            ) : (
                seizures.map((seizure) => (
                    <TableRow key={seizure.session_id}>
                        <TableCell className="font-medium">{seizure.name}</TableCell>
                        <TableCell className="text-right" title={seizure.time || ""}>
                            {formatRelativeTime(seizure.time)}
                        </TableCell>
                    </TableRow>
                ))
            )}
        </TableBody>
        </Table>
    )
}
