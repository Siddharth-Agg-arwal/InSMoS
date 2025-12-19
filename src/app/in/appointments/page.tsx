"use client";
import { useEffect, useState } from "react";
import { AppointmentCard } from "@/components/appointment-card";
import { AppointmentsTable } from "@/components/appointments-table";
import { Loader2 } from "lucide-react";

const API_BASE_URL = "http://localhost:8000/api/v1";

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

function formatTime(timeStr: string): string {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

function addMinutes(timeStr: string, mins: number): string {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes + mins);
    const h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
}

export default function AppointmentsPage() {
    const [todaysAppointments, setTodaysAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchTodaysAppointments() {
        try {
            setLoading(true);
            // Get today's date in YYYY-MM-DD format
            const today = new Date().toISOString().split("T")[0];
            const res = await fetch(`${API_BASE_URL}/appointments/`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data: Appointment[] = await res.json();
            // Filter for today's appointments
            const todayAppts = data.filter((appt) => appt.appointment_date === today);
            setTodaysAppointments(todayAppts);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTodaysAppointments();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <main
                className="flex items-start justify-between pt-8 pr-8 pb-8 flex-1"
                style={{ width: "calc(100vw - 17rem)" }}
            >
                <div className="ml-20 mt-8 bg-white rounded-xl p-6 flex-3 shadow h-[80vh]">
                    <AppointmentsTable />
                </div>
                <div className="mt-8 bg-white rounded-xl p-6 shadow flex-1 ml-5 h-[80vh] overflow-y-auto">
                    <h2 className="text-lg font-bold mb-4">Today's Appointments</h2>
                    {loading ? (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                            <span className="ml-2 text-gray-400 text-sm">Loading...</span>
                        </div>
                    ) : todaysAppointments.length === 0 ? (
                        <div className="text-sm text-neutral-400">
                            No appointments today.
                        </div>
                    ) : (
                        todaysAppointments.map((appt, idx) => (
                            <AppointmentCard
                                key={appt.id}
                                idx={idx}
                                reason={appt.reason}
                                patient={appt.patient_name}
                                doctor={appt.doctor_name}
                                time={formatTime(appt.appointment_time)}
                                toTime={addMinutes(appt.appointment_time, 30)}
                                status={appt.status}
                            />
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}