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

// Simulated EEG data (replace with live data as needed)
const eegData = Array.from({ length: 60 }, (_, i) => ({
	t: i,
	value: Math.sin(i / 3) + Math.random() * 0.5,
}))

export function EEGChart() {
	return (
		<Card className="bg-white mb-6">
			<CardHeader>
				<CardTitle className="text-green-700">EEG Live</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer className="h-[280px] w-full" config={{}}>
					<>
						<div className="h-full w-full">
							<ResponsiveContainer width="100%" height={260}>
								<LineChart
									data={eegData}
									margin={{ left: 12, right: 12, top: 10, bottom: 10 }}
								>
									<CartesianGrid vertical={false} stroke="#e5e7eb" />
									<XAxis
										dataKey="t"
										tick={{ fill: "#374151", fontSize: 12 }}
										label={{ value: "Time (s)", fill: "#374151", fontSize: 12, position: "insideBottom", offset: -5 }}
										tickLine={false}
										axisLine={{ stroke: "#e5e7eb" }}
										interval={9}
									/>
									<YAxis
										domain={[-2, 2]}
										tick={{ fill: "#374151", fontSize: 12 }}
										label={{ value: "μV", angle: -90, fill: "#374151", fontSize: 12, position: "insideLeft" }}
										axisLine={{ stroke: "#e5e7eb" }}
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
										stroke="#22c55e"
										strokeWidth={2}
										dot={false}
										isAnimationActive={false}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
						<div className="text-xs text-gray-500 mt-2">EEG: Electroencephalogram (μV vs Time)</div>
					</>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}