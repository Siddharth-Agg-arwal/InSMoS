"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Circle, Clock } from "lucide-react"
import SearchBar from "./search-bar";
import { useState } from "react";
import { PatientPage } from "./patient-page";

const patients = [
    {
        patient: "Sid",
        age: "12",
        status: "Severe",
        doctor: "Dr. Smith",
        updated: "Live",
        id: 0,
        details: "Sid has a history of epilepsy and is currently under observation.",
    },
    {
        patient: "John",
        age: "14",
        status: "Severe",
        doctor: "Dr. Adams",
        updated: "Live",
        id: 1,
        details: "John is being monitored for frequent seizures.",
    },
    {
        patient: "Josh",
        age: "10",
        status: "Moderate",
        doctor: "Dr. Lee",
        updated: "5m ago",
        id: 2,
        details: "Josh's condition is stable but requires regular checkups.",
    },
    {
        patient: "Tyler",
        age: "11",
        status: "Good",
        doctor: "Dr. Patel",
        updated: "15m ago",
        id: 3,
        details: "Tyler is recovering well and has shown improvement.",
    },
    {
        patient: "Josh",
        age: "10",
        status: "Good",
        doctor: "Dr. Lee",
        updated: "20m ago",
        id: 4,
        details: "Josh's last episode was 2 weeks ago.",
    },
    {
        patient: "Tyler",
        age: "11",
        status: "Good",
        doctor: "Dr. Patel",
        updated: "45m ago",
        id: 5,
        details: "Tyler is scheduled for a follow-up next month.",
    },
]

function getStatusClass(status: string) {
    if (status === "Severe") return "bg-red-100 text-red-700 px-2 py-1 rounded font-semibold";
    if (status === "Moderate") return "bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold";
    if (status === "Good") return "bg-green-100 text-green-700 px-2 py-1 rounded font-semibold";
    return "";
}

export function LiveMonitoring() {
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

    return (
        <div className="bg-white rounded-md p-2">
            <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-[500]">Patient Status</span>
                <SearchBar />
            </div>
            <Table className="w-full">
                <TableHeader>
                    <TableRow className="bg-[#D6D7F5] rounded-md">
                        <TableHead className="w-[100px]">Patient Name</TableHead>
                        <TableHead>Age (Months)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Doctor Name</TableHead>
                        <TableHead className="text-right">Last Updated</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {patients.map((patient, idx) => (
                        <TableRow
                            key={patient.patient + patient.doctor + idx}
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
                                {patient.updated === "Live" ? (
                                    <Circle className="h-3 w-3 text-green-500 animate-pulse" />
                                ) : (
                                    <Clock className="h-3 w-3 text-gray-400" />
                                )}
                                <span>{patient.updated}</span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {selectedPatientId !== null && (
                <PatientPage
                    patientId={selectedPatientId}
                    onClose={() => setSelectedPatientId(null)}
                    patients={patients}
                />
            )}
        </div>
    )
}
