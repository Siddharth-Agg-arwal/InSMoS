"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export interface EEGSeriesPoint { x: number; value: number | null }
export interface EEGSeries { column: string; points: EEGSeriesPoint[] }

interface EEGLineChartProps {
series: EEGSeries;
height?: number;
color?: string;
}

export const EEGLineChart: React.FC<EEGLineChartProps> = ({ series, height = 280, color = '#6366f1' }) => {
return (
    <Card className="w-full">
    <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{series.column}</CardTitle>
    </CardHeader>
    <CardContent>
        <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series.points} margin={{ top: 10, left: 0, right: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[ 'auto', 'auto' ]} />
            <Tooltip formatter={(v)=> v as any} labelFormatter={(l)=>`Index: ${l}`} />
            <Line type="monotone" dataKey="value" stroke={color} dot={false} strokeWidth={1.3} isAnimationActive={false} />
            </LineChart>
        </ResponsiveContainer>
        </div>
    </CardContent>
    </Card>
);
};
