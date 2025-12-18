"use client";
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface ColumnStats {
mean?: number; median?: number; min?: number; max?: number;
}
export interface StatsBarChartProps {
stats: Record<string, ColumnStats>;
title?: string;
maxColumns?: number; // limit for readability
}

export const EEGStatsBarChart: React.FC<StatsBarChartProps> = ({ stats, title = 'Column Statistics', maxColumns = 20 }) => {
const rows = Object.entries(stats)
    .filter(([, v]) => v.mean !== undefined)
    .slice(0, maxColumns)
    .map(([col, v]) => ({ column: col, mean: v.mean, median: v.median, min: v.min, max: v.max }));

if (!rows.length) return null;

return (
    <Card className="w-full">
    <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>Mean / Median / Min / Max</CardDescription>
    </CardHeader>
    <CardContent>
        <div className="w-full h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ left: 12, right: 12, top: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="column" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="mean" fill="#D6D7F5" radius={[4,4,0,0]} />
            <Bar dataKey="median" fill="#FF9593" radius={[4,4,0,0]} />
            <Bar dataKey="min" fill="#FDFD77" radius={[4,4,0,0]} />
            <Bar dataKey="max" fill="#D6E4E5" radius={[4,4,0,0]} />
            </BarChart>
        </ResponsiveContainer>
        </div>
    </CardContent>
    </Card>
);
};
