"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Circle, Clock, RefreshCw } from "lucide-react"
import SearchBar from "./search-bar";
import { useState, useEffect } from "react";
import { PatientPage } from "./patient-page";
import { Button } from "./ui/button";

interface Patient {
    id: number;
    name: string;
    age: number;
    status: string;
    doctor_id: number;
    condition?: string;
    blood_type?: string;
    seizure_frequency?: string;
    medication?: string;
    guardian?: string;
    contact?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';

function getStatusClass(status: string) {
    if (status === "Severe" || status === "Critical") return "bg-red-100 text-red-700 px-2 py-1 rounded font-semibold";
    if (status === "Moderate" || status === "At Risk") return "bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold";
    if (status === "Good" || status === "Stable") return "bg-green-100 text-green-700 px-2 py-1 rounded font-semibold";
    return "bg-gray-100 text-gray-700 px-2 py-1 rounded font-semibold";
}

export function LiveMonitoring() {
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPatients = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE}/api/v1/patients/`);
            if (!response.ok) {
                throw new Error(`Failed to fetch patients: ${response.statusText}`);
            }
            const data = await response.json();
            setPatients(data);
        } catch (err) {
            console.error("Error fetching patients:", err);
            setError(err instanceof Error ? err.message : "Failed to load patients");
            // Fallback to mock data if backend is not available
            setPatients([
                {
                    id: 1,
                    name: "Sid",
                    age: 12,
                    status: "Severe",
                    doctor_id: 1,
                    condition: "Epilepsy",
                    blood_type: "O+",
                    seizure_frequency: "2/month",
                    medication: "Levetiracetam",
                    guardian: "John Doe",
                    contact: "+1 234 567 8901",
                },
                {
                    id: 2,
                    name: "John",
                    age: 14,
                    status: "Severe",
                    doctor_id: 2,
                    condition: "Epilepsy",
                    blood_type: "A+",
                    seizure_frequency: "3/month",
                    medication: "Valproate",
                    guardian: "Jane Doe",
                    contact: "+1 234 567 8902",
                },
                {
                    id: 3,
                    name: "Josh",
                    age: 10,
                    status: "Moderate",
                    doctor_id: 3,
                    condition: "Epilepsy",
                    blood_type: "B+",
                    seizure_frequency: "1/month",
                    medication: "Carbamazepine",
                    guardian: "Mike Smith",
                    contact: "+1 234 567 8903",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
        // Refresh data every 30 seconds
        const interval = setInterval(fetchPatients, 30000);
        return () => clearInterval(interval);
    }, []);

    // Transform patients data to match the expected format for PatientPage
    const transformedPatients = patients.map(p => ({
        id: p.id,
        patient: p.name,
        age: `${p.age}`,
        status: p.status,
        doctor: `Doctor #${p.doctor_id}`,
        updated: "Live",
        condition: p.condition,
        blood_type: p.blood_type,
        seizure_frequency: p.seizure_frequency,
        medication: p.medication,
        guardian: p.guardian,
        contact: p.contact,
    }));

    return (
        <div className="bg-white rounded-md p-2">
            <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-[500]">Patient Status</span>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={fetchPatients}
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <SearchBar />
                </div>
            </div>

            {loading && patients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Loading patients...</div>
            ) : error && patients.length === 0 ? (
                <div className="text-center py-8 text-red-500">
                    {error}
                    <br />
                    <Button onClick={fetchPatients} className="mt-4" variant="outline">
                        Retry
                    </Button>
                </div>
            ) : (
                <>
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="bg-[#D6D7F5] rounded-md">
                                <TableHead className="w-[100px]">Patient Name</TableHead>
                                <TableHead>Age (Months)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Doctor ID</TableHead>
                                <TableHead className="text-right">Last Updated</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transformedPatients.map((patient) => (
                                <TableRow
                                    key={patient.id}
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => setSelectedPatientId(patient.id)}
                                >
                                    <TableCell className="font-medium">{patient.patient}</TableCell>
                                    <TableCell>{patient.age}</TableCell>
                                    <TableCell>
                                        <span className={getStatusClass(patient.status)}>
                                            {patient.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{patient.doctor}</TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-2">
                                        <Circle className="h-3 w-3 text-green-500 animate-pulse" />
                                        <span>Live</span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {selectedPatientId !== null && (
                        <PatientPage
                            patientId={selectedPatientId}
                            onClose={() => setSelectedPatientId(null)}
                            patients={transformedPatients}
                        />
                    )}
                </>
            )}
        </div>
    )
}
