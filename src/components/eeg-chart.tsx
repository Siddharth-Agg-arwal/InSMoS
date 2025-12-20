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
import { useWebSocket } from "@/hooks/use-websocket"
import { Activity } from "lucide-react"

interface EEGChartProps {
	patientId: number;
}

export function EEGChart({ patientId }: EEGChartProps) {
	const { data, isConnected, error } = useWebSocket(patientId, true);
	
	// Use useMemo to avoid infinite re-renders
	const chartData = React.useMemo(() => {
		const fiveSecondsAgo = Date.now() - (5 * 1000);
		return data
			.filter(d => new Date(d.timestamp).getTime() > fiveSecondsAgo)
			.map(d => ({
				t: new Date(d.timestamp).getTime(),
				value: d.channel_data && d.channel_data.length > 0 ? d.channel_data[0] : 0
			}));
	}, [data]);

	return (
		<Card className="bg-white mb-6">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="text-green-700 flex items-center gap-2">
						EEG Live
						{isConnected && (
							<Activity className="h-4 w-4 text-green-500 animate-pulse" />
						)}
					</CardTitle>
					<div className="text-xs text-gray-500">
						{isConnected ? "Connected" : error ? "Disconnected" : "Connecting..."}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer className="h-[280px] w-full" config={{}}>
					<>
						<div className="h-full w-full">
							<ResponsiveContainer width="100%" height={260}>
								<LineChart
									data={chartData}
									margin={{ left: 12, right: 12, top: 10, bottom: 10 }}
								>
									<CartesianGrid vertical={false} stroke="#e5e7eb" />
									<XAxis
										dataKey="t"
										tick={{ fill: "#374151", fontSize: 12 }}
									label={{ value: "Time", fill: "#374151", fontSize: 12, position: "insideBottom", offset: -5 }}
									tickLine={false}
									axisLine={{ stroke: "#e5e7eb" }}
									type="number"
									domain={['dataMin', 'dataMax']}
									tickFormatter={(value) => {
										const date = new Date(value);
										return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
									}}
									/>
									<YAxis
										domain={['auto', 'auto']}
										tick={{ fill: "#374151", fontSize: 12 }}
										label={{ value: "μV", angle: -90, fill: "#374151", fontSize: 12, position: "insideLeft" }}
										axisLine={{ stroke: "#e5e7eb" }}
										tickLine={false}
										width={40}
									/>
									<ChartTooltip
										content={
											<ChartTooltipContent
												className="w-[150px]"
												nameKey="value"
												labelFormatter={(value) => {
													const date = new Date(value);
													return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
												}}
											/>
										}
									/>
									<Line
										dataKey="value"
										type="linear"
										stroke="#22c55e"
										strokeWidth={2}
										dot={false}
										isAnimationActive={false}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
						<div className="text-xs text-gray-500 mt-2">
							EEG: Electroencephalogram (μV vs Time) | {chartData.length} data points
						</div>
					</>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}