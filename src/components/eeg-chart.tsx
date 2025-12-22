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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface EEGChartProps {
	patientId: number;
}

const CHANNEL_COLORS = [
	"#22c55e", // green
	"#3b82f6", // blue
	"#f59e0b", // amber
	"#ef4444", // red
	"#8b5cf6", // purple
	"#ec4899", // pink
	"#06b6d4", // cyan
	"#f97316", // orange
];

export function EEGChart({ patientId }: EEGChartProps) {
	const { data, isConnected, error } = useWebSocket(patientId, true);
	const [numChannels, setNumChannels] = React.useState(1);
	
	// Check if any recent data indicates seizure
	const hasSeizure = React.useMemo(() => {
		if (data.length === 0) return false;
		const recentData = data.slice(-10);
		return recentData.some(d => d.seizure_detected === true);
	}, [data]);
	
	// Use useMemo to avoid infinite re-renders
	const chartData = React.useMemo(() => {
		const fiveSecondsAgo = Date.now() - (5 * 1000);
		const rawData = data
			.filter(d => new Date(d.timestamp).getTime() > fiveSecondsAgo)
			.map(d => {
				const dataPoint: any = { t: new Date(d.timestamp).getTime() };
				
				// Extract data for each channel based on numChannels
				for (let i = 0; i < numChannels; i++) {
					dataPoint[`ch${i}`] = d.channel_data && d.channel_data.length > i ? d.channel_data[i] : 0;
				}
				
				return dataPoint;
			});
		
		// Normalize each channel separately
		if (rawData.length === 0) return rawData;
		
		return rawData.map(d => {
			const normalized: any = { t: d.t };
			
			for (let i = 0; i < numChannels; i++) {
				const channelKey = `ch${i}`;
				const values = rawData.map(point => point[channelKey]);
				const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
				const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
				const stdDev = Math.sqrt(variance);
				
				// Apply z-score normalization and scale
				if (stdDev === 0) {
					normalized[channelKey] = 50;
				} else {
					normalized[channelKey] = ((d[channelKey] - mean) / stdDev) * 20 + 50;
				}
			}
			
			return normalized;
		});
	}, [data, numChannels]);

	return (
		<Card className={`bg-white mb-6 transition-all ${hasSeizure ? 'border-2 border-red-500 shadow-lg shadow-red-200' : ''}`}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className={`flex items-center gap-2 ${hasSeizure ? 'text-red-700' : 'text-green-700'}`}>
						{hasSeizure ? '⚠️ SEIZURE DETECTED' : 'EEG Live'}
						{isConnected && (
							<Activity className={`h-4 w-4 animate-pulse ${hasSeizure ? 'text-red-500' : 'text-green-500'}`} />
						)}
						{/* Hidden channel selector */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button 
									className="w-3 h-3 bg-white hover:bg-gray-50 rounded opacity-20 hover:opacity-100 transition-opacity ml-2 border border-gray-100"
									title="Select channels"
								/>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="bg-white">
								{[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
									<DropdownMenuItem
										key={num}
										onClick={() => setNumChannels(num)}
										className={numChannels === num ? "bg-gray-100" : ""}
									>
										{num} Channel{num > 1 ? 's' : ''}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</CardTitle>
					<div className="flex items-center gap-2">
						<div className="text-xs text-gray-500">
							{isConnected ? "Connected" : error ? "Disconnected" : "Connecting..."}
						</div>
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
										domain={[0, 100]}
										tick={{ fill: "#374151", fontSize: 12 }}
										label={{ value: "Voltage μV", angle: -90, fill: "#374151", fontSize: 12, position: "insideLeft" }}
										axisLine={{ stroke: "#e5e7eb" }}
										tickLine={false}
										width={60}
									/>
									<ChartTooltip
										content={({ active, payload }) => {
											if (!active || !payload || payload.length === 0) return null;
											
											const dataPoint = payload[0].payload;
											const timestamp = dataPoint.t;
											const date = new Date(timestamp);
											const timeStr = date.toLocaleTimeString('en-US', { 
												hour: '2-digit', 
												minute: '2-digit', 
												second: '2-digit',
												hour12: false 
											});
											
											return (
												<div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
													{/* <p className="text-xs text-gray-500 mb-2">{timeStr}</p> */}
													<div className="space-y-1">
														{payload.map((entry: any, index: number) => (
															<div key={index} className="flex items-center justify-between gap-3">
																<div className="flex items-center gap-2">
																	<div 
																		className="w-2 h-2 rounded-full" 
																		style={{ backgroundColor: entry.stroke }}
																	/>
																	<span className="text-xs font-medium">{entry.name}</span>
																</div>
																<span className="text-xs font-bold">{entry.value?.toFixed(1)}μV</span>
															</div>
														))}
													</div>
												</div>
											);
										}}
									/>
									{/* Render a line for each channel */}
									{Array.from({ length: numChannels }, (_, i) => (
										<Line
											key={`ch${i}`}
											dataKey={`ch${i}`}
											type="linear"
											stroke={CHANNEL_COLORS[i]}
											strokeWidth={2}
											dot={false}
											isAnimationActive={false}
											name={`Channel ${i + 1}`}
										/>
									))}
								</LineChart>
							</ResponsiveContainer>
						</div>
						<div className="text-xs text-gray-500 mt-2">
							EEG: Electroencephalogram (Normalized μV vs Time) | {chartData.length} data points | {numChannels} channel{numChannels > 1 ? 's' : ''}
						</div>
					</>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
