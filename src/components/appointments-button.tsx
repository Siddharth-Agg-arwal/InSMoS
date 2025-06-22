import {CalendarPlus2} from "lucide-react";

export default function AddAppointmentsButton() {
    return (
        <button
            className="text-[#FF9593] border-[#FF9593] border-1 px-4 py-2 rounded-md hover:bg-[#FF9593] hover:text-white transition-colors"
            onClick={() => alert("Add Appointment Clicked")}
        >
            <CalendarPlus2 className="h-4 w-4 inline-block mr-4" />
            Add Appointment
        </button>
    );
}