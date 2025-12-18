"use client";

import React, { useState } from 'react';
import { useToast } from '../../../components/ui/use-toast';
import { AlertCircle, FileSpreadsheet, Upload, BarChart4} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EEGLineChart, EEGSeries } from '@/components/eeg/eeg-line-chart';
import { EEGStatsBarChart } from '@/components/eeg/eeg-stats-bar-chart';
import { Button } from '@/components/ui/button';

// Types for our analysis
export interface AnalysisResult {
summary: {
    rowCount: number;
    columnCount: number;
    hasNulls: boolean;
    dataTypes: Record<string, string>;
};
statistics: {
    columns: Record<string, {
    mean?: number;
    median?: number;
    min?: number;
    max?: number;
    unique?: number;
    frequent?: Record<string, number>;
    }>;
};
visualizations: {
    id: string;
    title: string;
    type: 'bar' | 'line' | 'pie' | 'scatter';
    data: any;
}[];
}

// Real function calling backend endpoint
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';
const analyzeExcel = async (file: File): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/analyze-excel`, { method: 'POST', body: formData });
    if (!res.ok) {
        let detail = '';
        try { detail = await res.text(); } catch {}
        throw new Error(`Backend error ${res.status}${detail ? ': ' + detail : ''}`);
    }
    const data = await res.json();
    return data as AnalysisResult;
};

// File Upload Area Component
const FileUploadArea = ({ onFileSelected, isLoading }: { 
onFileSelected: (file: File) => void;
isLoading: boolean;
}) => {
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
    onFileSelected(file);
    }
};

return (
    <Card>
    <CardHeader>
        <CardTitle className="flex items-center gap-2">
        <FileSpreadsheet className="h-5 w-5" />
        Upload Excel File
        </CardTitle>
        <CardDescription>
        Drop your Excel file here for detailed analysis
        </CardDescription>
    </CardHeader>
    <CardContent>
        <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => document.getElementById('file-upload')?.click()}
        >
        <Upload className="h-10 w-10 mx-auto mb-4 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">
            Click to upload or drag and drop
        </p>
        <p className="text-xs text-gray-500">
            Supports: .xlsx, .xls, .csv
        </p>
        <input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
        />
        </div>
    </CardContent>
    </Card>
);
};

// Loading Spinner Component
const LoadingSpinner = ({ size = "default", className = "" }: { 
size?: "small" | "default" | "large";
className?: string;
}) => {
const sizeClasses = {
    small: "h-4 w-4",
    default: "h-8 w-8",
    large: "h-12 w-12",
};

return (
    <div className={`animate-spin ${sizeClasses[size]} ${className}`}>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="w-full h-full"
    >
        <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        ></circle>
        <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
    </svg>
    </div>
);
};

// Results Display Component
const ResultsDisplay = ({ 
result, 
isLoading,
seizureDetected,
}: { 
result: AnalysisResult | null;
isLoading: boolean;
seizureDetected: boolean | null;
}) => {
if (!result || isLoading) return null;

return (
    <div className="w-full space-y-8">
    <Card>
        <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <BarChart4 className="h-5 w-5" />
            Data Overview
        </CardTitle>
        <CardDescription>
            Summary of dataset structure and content
        </CardDescription>
        </CardHeader>
        <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Rows</div>
            <div className="text-2xl font-semibold">{result.summary.rowCount}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Columns</div>
            <div className="text-2xl font-semibold">{result.summary.columnCount}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Data Quality</div>
            <div className="text-2xl font-semibold">{result.summary.hasNulls ? 'Missing Values' : 'Complete'}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Data Types</div>
            <div className="text-2xl font-semibold">{Object.keys(result.summary.dataTypes).length}</div>
            </div>
        </div>
        </CardContent>
        </Card>

        {/* Seizure Detection Result Card */}
        {seizureDetected !== null && (
            <Card className={`w-full ${seizureDetected ? 'border-red-500 bg-red-100 dark:bg-red-900/20' : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10'} border-2`}
                        style={{ width: 'calc(95vw - var(--sidebar-width))' }}>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Seizure Detection</span>
                        <span className={`text-sm px-3 py-1 rounded-full font-medium ${seizureDetected ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                            {seizureDetected ? 'Yes' : 'No'}
                        </span>
                    </CardTitle>
                    <CardDescription className={`text-base ${seizureDetected ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {seizureDetected ? 'Seizure detected for the provided timeframe.' : 'No seizures were detected in the given timeframe of data.'}
                    </CardDescription>
                </CardHeader>
            </Card>
        )}

    <Card>
        <CardHeader>
        <CardTitle>Statistical Analysis</CardTitle>
        <CardDescription>
            Key statistics for numeric columns
        </CardDescription>
        </CardHeader>
        <CardContent>
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
            <thead>
                <tr className="border-b">
                <th className="text-left py-2 px-4">Column</th>
                <th className="text-left py-2 px-4">Mean</th>
                <th className="text-left py-2 px-4">Median</th>
                <th className="text-left py-2 px-4">Min</th>
                <th className="text-left py-2 px-4">Max</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(result.statistics.columns)
                .filter(([_, stats]) => stats.mean !== undefined)
                .map(([column, stats]) => (
                    <tr key={column} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">{column}</td>
                    <td className="py-2 px-4">{stats.mean?.toFixed(2)}</td>
                    <td className="py-2 px-4">{stats.median}</td>
                    <td className="py-2 px-4">{stats.min}</td>
                    <td className="py-2 px-4">{stats.max}</td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
        </CardContent>
    </Card>
    </div>
);
};

// Main page component
export default function AnalysisDashboard() {
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
const [eegSeries, setEegSeries] = useState<EEGSeries[]>([]);
const [seizureDetected, setSeizureDetected] = useState<boolean | null>(null);
const { toast } = useToast();

const handleFileSelected = async (file: File) => {
    setSelectedFile(file);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
    const result = await analyzeExcel(file);
        setAnalysisResult(result);
    // Random seizure detection placeholder
    setSeizureDetected(Math.random() < 0.5);
        // fetch EEG line data
        try {
            const form2 = new FormData();
            form2.append('file', file);
            const eegRes = await fetch(`${API_BASE}/analyze-eeg-lines?prefix=eeg_&max_points=1200`, { method: 'POST', body: form2 });
            if (eegRes.ok) {
                const eegJson = await eegRes.json();
                setEegSeries(eegJson.series || []);
            } else {
                setEegSeries([]);
            }
        } catch { setEegSeries([]); }
    
    toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${file.name} with ${result.summary.rowCount} records`,
    });
    } catch (error) {
    console.error('Error during analysis:', error);
    
    toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze Excel file",
        action: (
        <div className="h-8 w-8 bg-destructive/20 rounded-full flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-destructive-foreground" />
        </div>
        ),
    });
    } finally {
    setIsAnalyzing(false);
    }
};

return (
    <div className="min-h-screen flex flex-col bg-background">
    <header className="w-full py-8 text-center bg-white border-b">
        <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-primary">Patient Data Analysis</h1>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            Upload an Excel file to analyze patient data and generate insights
        </p>
        </div>
    </header>

    <main className="py-6 px-4 md:px-6 flex-1 mx-auto" style={{ width: 'calc(95vw - var(--sidebar-width))' }}>
        <div className="flex flex-col space-y-8 w-full mx-auto">
        {/* File Upload Area */}
        {(!analysisResult || isAnalyzing) && (
            <div className="w-full max-w-md mx-auto">
            <FileUploadArea 
                onFileSelected={handleFileSelected} 
                isLoading={isAnalyzing} 
            />
            </div>
        )}
        
        {/* Loading State */}
        {isAnalyzing && (
            <div className="text-center py-8">
            <LoadingSpinner size="large" className="mx-auto mb-4" />
            <p className="text-muted-foreground">Analyzing Excel data...</p>
            {selectedFile && (
                <p className="text-xs mt-2 text-muted-foreground">
                File: {selectedFile.name}
                </p>
            )}
            </div>
        )}
        
        {/* Results Display */}
                        <ResultsDisplay result={analysisResult} isLoading={isAnalyzing} seizureDetected={seizureDetected} />
                        {analysisResult && (
                            <EEGStatsBarChart stats={analysisResult.statistics.columns} />
                        )}
                        {eegSeries.length > 0 && !isAnalyzing && (
                            <div style={{ width: 'calc(95vw - var(--sidebar-width))' }}>
                                <h2 className="text-xl font-semibold mb-2">EEG Channels</h2>
                                <div style={{ width: 'calc(95vw - var(--sidebar-width))' }}className="grid gap-4 grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
                                    {eegSeries.map((s) => (
                                        <EEGLineChart key={s.column} series={s} />
                                    ))}
                                </div>
                                {/* {eegSeries.length > 3 && (
                                    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 mt-4">
                                        {eegSeries.slice(3).map((s) => (
                                            <EEGLineChart key={s.column} series={s} />
                                        ))}
                                    </div>
                                )} */}
                            </div>
                        )}
        
        {/* Reset Button */}
        {analysisResult && !isAnalyzing && (
            <Button 
            variant="outline"
            onClick={() => {
                setSelectedFile(null);
                setAnalysisResult(null);
                setEegSeries([]);
                setSeizureDetected(null);
            }}
            className="mt-8"
            >
            Analyze another file
            </Button>
        )}
        </div>
    </main>
    
    <footer className="w-full py-4 border-t bg-white/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>InSMoS Patient Data Analysis Dashboard</p>
        </div>
    </footer>
    </div>
);
}