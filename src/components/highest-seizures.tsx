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

interface TopPatient {
    patient_id: number;
    name: string;
    count: number;
}

export function HeighestSeizures() {
    const [patients, setPatients] = useState<TopPatient[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${API_BASE}/api/v1/sessions/top-patients?limit=4`);
                if (res.ok) {
                    const data = await res.json();
                    setPatients(data);
                }
            } catch (error) {
                console.error("Error fetching top seizure patients:", error);
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
            <TableHead className="text-right">Count</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {patients.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={2} className="text-center text-gray-400">
                        No data available
                    </TableCell>
                </TableRow>
            ) : (
                patients.map((patient) => (
                    <TableRow key={patient.patient_id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell className="text-right">{patient.count}</TableCell>
                    </TableRow>
                ))
            )}
        </TableBody>
        </Table>
    )
}
