import { SquareCard } from "@/components/ui/square-card";
import { Activity, Camera, Cpu, HeartPulse } from "lucide-react";

export default function LiveFeed() {
return (
<div className="flex h-fit bg-gray-100">
    <main
    className="pt-8 pr-24 pb-8 w-full"
    style={{ width: "calc(100vw - 17rem)" }}
    >
    <div className="pl-20 grid grid-cols-1 gap-6 md:grid-cols-4">
        <SquareCard
        icon={<Activity className="h-6 w-6 text-blue-500" />}
        iconClassName="text-blue-500"
        title="Total Patients"
        value={128}
        description="Number of patients being monitored"
        bgColor="bg-[#D6D7F5]"
        />
        <SquareCard
        icon={<Camera className="h-6 w-6 text-green-500" />}
        iconClassName="text-green-500"
        title="Critical Patients"
        value={12}
        description="Patients in critical condition."
        bgColor="bg-[#FF9593]"
        />
        <SquareCard
        icon={<Cpu className="h-6 w-6 text-purple-500" />}
        iconClassName="text-purple-500"
        title="At Alert Patients"
        value={87}
        description="Patients at risk of complications."
        bgColor="bg-[#FDFD77]"
        />
        <SquareCard
        icon={<HeartPulse className="h-6 w-6 text-red-500" />}
        iconClassName="text-red-500"
        title="Healthy Patients"
        value={76}
        description="Patients with stable health."
        bgColor="bg-[#D6E4E5]"
        />
    </div>

    
    </main>
</div>
);
}