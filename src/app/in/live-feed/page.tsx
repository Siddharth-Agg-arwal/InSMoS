import { LiveMonitoring } from "@/components/live-monitoring-table";
import SearchBar from "@/components/search-bar";
import { SquareCard } from "@/components/ui/square-card";
import { Activity, Camera, Cpu, HeartPulse, Users, OctagonAlert, SquareAsterisk, ScanHeart } from "lucide-react";

export default function LiveFeed() {
return (
<div className="flex h-screen bg-gray-100">
    <main
    className="pt-8 pr-24 pb-8 w-full"
    style={{ width: "calc(100vw - 17rem)" }}
    >
    <div className="pl-20 grid grid-cols-1 gap-6 md:grid-cols-4">
        <SquareCard
        icon={<Users className="h-8 w-8" />}
        iconClassName="text-black"
        title="Total Patients"
        value={128}
        description="Number of patients being monitored"
        bgColor="bg-[#D6D7F5]"
        />
        <SquareCard
        icon={<OctagonAlert className="h-8 w-8" />}
        iconClassName="text-black"
        title="Critical Patients"
        value={12}
        description="Patients in critical condition."
        bgColor="bg-[#FF9593]"
        />
        <SquareCard
        icon={<SquareAsterisk className="h-8 w-8" />}
        iconClassName="text-black"
        title="At Alert Patients"
        value={87}
        description="Patients at risk of complications."
        bgColor="bg-[#FDFD77]"
        />
        <SquareCard
        icon={<ScanHeart className="h-8 w-8" />}
        iconClassName="text-black"
        title="Healthy Patients"
        value={76}
        description="Patients with stable health."
        bgColor="bg-[#D6E4E5]"
        />
    </div>
    <div className="ml-20 mt-8 bg-white rounded-xl p-6">
        <LiveMonitoring />
    </div>
    </main>
</div>
);
}