"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Circle, Clock, CalendarX2, CheckCircle2, Loader2 } from "lucide-react";
import SearchBar from "./search-bar";
import AddAppointmentsButton from "./appointments-button";

// Type matching API response
interface Appointment {
    id: number;
    patient_id: number;
    patient_name: string;
    is_new_patient: boolean;
    patient_age: number;
    appointment_date: string;
    appointment_time: string;
    doctor_id: number;
    doctor_name: string;
    reason: string;
    notes: string | null;
    status: string;
    created_at: string;
}

const API_BASE_URL = "http://localhost:8000/api/v1";

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatTime(timeStr: string): string {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

function getStatusClass(status: string) {
    const base = "flex justify-center items-center px-2 py-1 rounded font-semibold";
    if (status === "Cancelled") return `${base} bg-red-100 text-red-700`;
    if (status === "Pending") return `${base} bg-yellow-100 text-yellow-700`;
    if (status === "Confirmed") return `${base} bg-green-100 text-green-700`;
    if (status === "Completed") return `${base} bg-blue-100 text-blue-700`;
    return base;
}

function StatusIcon({ status }: { status: string }) {
    if (status === "Pending") return <Clock className="h-3 w-3 text-black animate-pulse m-1" />;
    if (status === "Confirmed") return <Circle className="h-3 w-3 text-green-500 animate-pulse m-1" />;
    if (status === "Cancelled") return <CalendarX2 className="h-3 w-3 text-red-500 m-1" />;
    if (status === "Completed") return <CheckCircle2 className="h-3 w-3 text-blue-500 m-1" />;
    return null;
}

export function AppointmentsTable() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchAppointments() {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/appointments/`);
            if (!res.ok) throw new Error("Failed to fetch appointments");
            const data: Appointment[] = await res.json();
            setAppointments(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAppointments();
    }, []);

    return (
        <div className="bg-white rounded-md p-2">
            <div className="flex items-center justify-between mb-4">
                <div><span className="text-lg font-[500]">Appointments</span></div>
                <div className="flex items-center gap-4">
                    <SearchBar />
                    <AddAppointmentsButton onAppointmentCreated={fetchAppointments} />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Loading appointments...</span>
                </div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
            ) : appointments.length === 0 ? (
                <div className="text-center py-10 text-gray-400">No appointments found.</div>
            ) : (
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="bg-[#D6D7F5] rounded-md">
                            <TableHead className="w-[150px]">Patient</TableHead>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments.map((appt) => (
                            <TableRow key={appt.id}>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{appt.patient_name}</span>
                                        {appt.is_new_patient && (
                                            <span className="text-xs text-blue-500">New Patient</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{appt.doctor_name}</TableCell>
                                <TableCell>{formatDate(appt.appointment_date)}</TableCell>
                                <TableCell>{formatTime(appt.appointment_time)}</TableCell>
                                <TableCell className="max-w-[150px] truncate" title={appt.reason}>
                                    {appt.reason}
                                </TableCell>
                                <TableCell className="text-right flex items-center justify-end gap-2">
                                    <span className={getStatusClass(appt.status)}>
                                        <StatusIcon status={appt.status} />
                                        {appt.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
