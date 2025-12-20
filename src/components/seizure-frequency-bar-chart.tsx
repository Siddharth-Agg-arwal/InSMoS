"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
Card,
CardContent,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card"
import {
ChartConfig,
ChartContainer,
ChartTooltip,
ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart with a label"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';

const chartConfig = {
seizures: {
    label: "Seizures",
    color: "var(--chart-1)",
},
} satisfies ChartConfig

export function SeizureFrequencyBarChart() {
    const [chartData, setChartData] = useState<{ month: string; seizures: number }[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${API_BASE}/api/v1/sessions/frequency/monthly?months=6`);
                if (res.ok) {
                    const data = await res.json();
                    setChartData(data);
                }
            } catch (error) {
                console.error("Error fetching seizure frequency:", error);
            }
        }
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

return (
    // <Card>
    // <CardHeader>
    //     <CardTitle>Bar Chart - Label</CardTitle>
    //     <CardDescription>January - June 2024</CardDescription>
    // </CardHeader>
    // <CardContent>
        <ChartContainer config={chartConfig} className="h-45">
        <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
            top: 10,
            }}
        >
            <CartesianGrid vertical={false} />
            <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="seizures" fill="#D6D7F5" radius={8}>
            <LabelList
                position="top"
                offset={12}
                // className="fill-foreground"
                fontSize={12}
            />
            </Bar>
        </BarChart>
        </ChartContainer>
    // </CardContent>
    // <CardFooter className="flex-col items-start gap-2 text-sm">
    //     <div className="flex gap-2 leading-none font-medium">
    //     Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
    //     </div>
    //     <div className="text-muted-foreground leading-none">
    //     Showing total visitors for the last 6 months
    //     </div>
    // </CardFooter>
    // </Card>
)
}
