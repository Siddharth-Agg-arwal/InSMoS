"use client";
import { AppointmentCard } from "@/components/appointment-card";
import { AppointmentsTable } from "@/components/appointments-table";

// Example cards data for today's appointments
const todaysAppointments = [
	{
		patient: "Sid",
		doctor: "Dr. Smith",
        toTime : "10:30 AM",
		time: "10:00 AM",
        reason:"Routine checkup",
		status: "Confirmed",
	},
	{
		patient: "Josh",
		doctor: "Dr. Lee",
		time: "11:30 AM",
        toTime : "12:00 PM",
        reason:"Routine checkup",
		status: "Pending",
	},
    {
		patient: "Morris",
		doctor: "Dr. Lee",
		time: "11:30 AM",
        toTime : "12:00 PM",
        reason:"Routine checkup",
		status: "Cancelled",
	},
];

export default function AppointmentsPage() {
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
                    {todaysAppointments.length === 0 ? (
                        <div className="text-sm text-neutral-400">
                            No appointments today.
                        </div>
                    ) : (
                        todaysAppointments.map((appt, idx) => (
                            <AppointmentCard
                                key={idx}
                                idx={idx}
                                reason={appt.reason}
                                patient={appt.patient}
                                doctor={appt.doctor}
                                time={appt.time}
                                toTime={appt.toTime}
                                status={appt.status}
                            />
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}