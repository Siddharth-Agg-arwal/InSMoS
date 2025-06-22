"use client";
import { AppointmentsTable } from "@/components/appointments-table";

export default function AppointmentsPage() {
return (
    <div className="flex h-fit bg-gray-100">
                <main
                    className="pt-8 pr-24 pb-8"
                    style={{ width: "calc(100vw - 17rem)" }}
                >
                <div className="ml-20 mt-8 bg-white rounded-xl p-6">
                    <AppointmentsTable />
                </div>
                    {/* <BentoGridDemo /> */}
                </main>
            </div>
);
}