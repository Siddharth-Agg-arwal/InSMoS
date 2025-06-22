import React from "react";
import { Circle, Clock, CalendarX2 } from "lucide-react";

const cardColors = [
	"bg-[#D6D7F5]",
	"bg-[#FF9593]",
	// "bg-[#FDFD77]",
	"bg-[#D6E4E5]",
];

function getRandomColor(idx: number) {
	// Deterministic: pick color based on idx so it doesn't change on re-render
	return cardColors[idx % cardColors.length];
}

function getStatusIconAndTextColor(status: string) {
	if (status === "Cancelled")
		return {
			icon: <CalendarX2 className="h-3 w-3 text-red-500 mr-1" />,
			text: "text-red-600",
		};
	if (status === "Pending")
		return {
			icon: <Clock className="h-3 w-3 text-yellow-500 mr-1" />,
			text: "text-yellow-600",
		};
	if (status === "Confirmed")
		return {
			icon: <Circle className="h-3 w-3 text-green-500 mr-1" />,
			text: "text-green-600",
		};
	return { icon: null, text: "text-neutral-700" };
}

export function AppointmentCard({
	patient,
	doctor,
	time,
	toTime,
	status,
	reason,
	idx = 0, // Accept idx as prop for deterministic color
}: {
	patient: string;
	doctor: string;
	time: string;
	toTime?: string;
	status: string;
	reason?: string;
	idx?: number;
}) {
	const cardBg = getRandomColor(idx);
	const { icon, text } = getStatusIconAndTextColor(status);

	// Status button: white bg, dark grey border, colored text, icon
	const statusClass =
		`bg-white border border-neutral-400 inline-flex items-center mt-2 px-2 py-1 rounded text-xs font-semibold ${text}`;

	return (
		<div
			className={`rounded-lg border border-neutral-200 ${cardBg} p-4 mb-4 shadow`}
		>
			<div className="flex items-start justify-between">
				<div className="font-semibold text-neutral-800">{patient}</div>
				<div className="font-bold text-base text-neutral-800">
					{toTime ? `${time} - ${toTime}` : time}
				</div>
			</div>
			<div className="text-xs text-neutral-700">{doctor}</div>
			{reason && (
				<div className="text-xs text-neutral-600 italic mt-1">{reason}</div>
			)}
			<div className={statusClass}>
				{icon}
				{status}
			</div>
		</div>
	);
}