"use client";

import { useState } from "react";
import { CalendarPlus2 } from "lucide-react";
import { AppointmentForm } from "@/components/appointment-form";

interface AddAppointmentsButtonProps {
    onAppointmentCreated?: () => void;
}

export default function AddAppointmentsButton({ onAppointmentCreated }: AddAppointmentsButtonProps) {
    const [open, setOpen] = useState(false);

    function handleConfirm() {
        setOpen(false);
        if (onAppointmentCreated) onAppointmentCreated();
    }

    return (
        <>
            <button
                className="text-[#FF9593] border-[#FF9593] border-1 px-4 py-2 rounded-md hover:bg-[#FF9593] hover:text-white transition-colors"
                onClick={() => setOpen(true)}
            >
                <CalendarPlus2 className="h-4 w-4 inline-block mr-4" />
                Add Appointment
            </button>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-4">
                        <AppointmentForm
                            onCancel={() => setOpen(false)}
                            onConfirm={handleConfirm}
                        />
                    </div>
                </div>
            )}
        </>
    );
}