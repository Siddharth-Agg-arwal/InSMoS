"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
Card,
CardContent,
CardHeader,
CardTitle,
} from "@/components/ui/card"
import {
ChartContainer,
ChartTooltip,
ChartTooltipContent,
} from "@/components/ui/chart"

// Simulated EMG data (replace with live data as needed)
const emgData = Array.from({ length: 60 }, (_, i) => ({
t: i,
value: Math.cos(i / 2) + Math.random() * 0.7,
}))

export function EMGChart() {
return (
    <Card className="bg-[#23272e]">
    <CardHeader>
        <CardTitle className="text-blue-400">EMG Live</CardTitle>
    </CardHeader>
    <CardContent>
        <ChartContainer className="h-[280px] w-full" config={{}}>
        <>
            <div className="h-full w-full">
            <ResponsiveContainer width="100%" height={260}>
            <LineChart
                data={emgData}
                margin={{ left: 12, right: 12, top: 10, bottom: 10 }}
            >
                <CartesianGrid vertical={false} stroke="#444" />
                <XAxis
                dataKey="t"
                tick={{ fill: "#aaa", fontSize: 12 }}
                label={{ value: "Time (s)", fill: "#aaa", fontSize: 12, position: "insideBottom", offset: -5 }}
                tickLine={false}
                axisLine={{ stroke: "#444" }}
                interval={9}
                />
                <YAxis
                domain={[-2, 2]}
                tick={{ fill: "#aaa", fontSize: 12 }}
                label={{ value: "mV", angle: -90, fill: "#aaa", fontSize: 12, position: "insideLeft" }}
                axisLine={{ stroke: "#444" }}
                tickLine={false}
                width={40}
                />
                <ChartTooltip
                content={
                    <ChartTooltipContent
                    className="w-[120px]"
                    nameKey="value"
                    labelFormatter={(value) => `t: ${value}s`}
                    />
                }
                />
                <Line
                dataKey="value"
                type="monotone"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                />
            </LineChart>
            </ResponsiveContainer>
            </div>
            <div className="text-xs text-gray-400 mt-2">EMG: Electromyogram (mV vs Time)</div>
        </>
        </ChartContainer>
    </CardContent>
    </Card>
)
}