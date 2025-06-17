import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
IconArrowWaveRightUp,
IconBoxAlignRightFilled,
IconBoxAlignTopLeft,
IconClipboardCopy,
IconFileBroken,
IconSignature,
IconTableColumn,
} from "@tabler/icons-react";
import { SeizureFrequencyBarChart } from "./seizure-frequency-bar-chart";
import { UptimeLineChart } from "./uptime-line-chart";
import StatValue from "./stat-values";
import { HeighestSeizures } from "./highest-seizures";
import { MostRecentSeizures } from "./most-recent-seizures";

export function BentoGridDemo() {
return (
    <BentoGrid className="max-w-5xl mx-auto">
    {items.map((item, i) => (
        <BentoGridItem
        key={i}
        title={item.title}
        description={item.description}
        header={item.header}
        icon={item.icon}
        className={cn(item.className, i === 3 || i === 6 ? "md:col-span-2" : "")}
        />
    ))}
    </BentoGrid>
);
}
const Skeleton = () => (
<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);
const items = [
{
    title: "Total Number of Patients",
    description: "Number of patients being monitored live now.",
    header: <StatValue value={34} />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
    className: "bg-[#D6D7F5]"
},
{
    title: "At Risk Patients",
    description: "Patients who are experiencing seizures actively",
    header: <StatValue value={12} />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    className: "bg-[#D6E4E5]"
},
{
    title: "Seizures Detected",
    description: "Number of seizures detected in the last 24 hours.",
    header: <StatValue value={134} />,
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
    className: "bg-[#FDFD77]"
},
{
    title: "Average Seizure Frequency",
    description:
    "Daily frequency of seizures being detected.",
    header: <SeizureFrequencyBarChart />,
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    className: "bg-white"
},
{
    title: "System Uptime",
    description: "Uninterrupted service.",
    header: <UptimeLineChart />,
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
    className: "bg-[#D6E4E5]"
},
{
    title: "Flagged Patients",
    description: "Patients with highest seizure frequency.",
    header: <HeighestSeizures />,
    icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
    className: "bg-[#D6D7F5]"
},
{
    title: "Most Recent Seizure Patients",
    description: "Patients who had seizures most recently.",
    header: <MostRecentSeizures />,
    icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
    className: "bg-white"
},
];
