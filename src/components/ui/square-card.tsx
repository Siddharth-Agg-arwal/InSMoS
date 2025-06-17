import { cn } from "@/lib/utils";

export function SquareCard({
className,
title,
description,
icon,
value,
iconClassName,
bgColor,
}: {
className?: string;
title?: string | React.ReactNode;
description?: string | React.ReactNode;
icon?: React.ReactNode;
value: number | string;
iconClassName?: string;
bgColor?: string; // Tailwind color class, e.g. "bg-blue-100"
}) {
return (
    <div
    className={cn(
        "relative flex flex-col justify-between aspect-square rounded-xl border border-neutral-200 p-6 shadow transition duration-200 hover:shadow-lg dark:border-white/[0.2] dark:bg-black dark:shadow-none",
        bgColor,
        className
    )}
    >
    {/* Icon in top-left */}
    <div className={cn("absolute top-4 left-4", iconClassName)}>{icon}</div>
    {/* Value in center */}
    <div className="flex flex-1 items-center justify-center">
        <span className="text-4xl font-bold text-neutral-800 dark:text-neutral-100">{value}</span>
    </div>
    {/* Title and icon at the bottom */}
    <div className="flex items-center gap-2 mt-4">
        {/* <span className={iconClassName}>{icon}</span> */}
        <span className="text-xl font-semibold text-neutral-700 dark:text-neutral-200">{title}</span>
    </div>
    {/* Description below title */}
    <div className="mt-1 text-xm text-neutral-500 dark:text-neutral-300 text-left">{description}</div>
    </div>
);
}