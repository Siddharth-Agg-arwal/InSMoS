import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
    } from "@/components/ui/table"
    import { Circle, Clock } from "lucide-react"
import SearchBar from "./search-bar";
    
    const patients = [
    {
        patient: "Sid",
        age: "12",
        status: "Severe",
        doctor: "Dr. Smith",
        updated: "Live",
    },
    {
        patient: "John",
        age: "14",
        status: "Severe",
        doctor: "Dr. Adams",
        updated: "Live",
    },
    {
        patient: "Josh",
        age: "10",
        status: "Moderate",
        doctor: "Dr. Lee",
        updated: "5m ago",
    },
    {
        patient: "Tyler",
        age: "11",
        status: "Good",
        doctor: "Dr. Patel",
        updated: "15m ago",
    },
    {
        patient: "Josh",
        age: "10",
        status: "Good",
        doctor: "Dr. Lee",
        updated: "20m ago",
    },
    {
        patient: "Tyler",
        age: "11",
        status: "Good",
        doctor: "Dr. Patel",
        updated: "45m ago",
    },
    ]
    
    function getStatusClass(status: string) {
    if (status === "Severe") return "bg-red-100 text-red-700 px-2 py-1 rounded font-semibold";
    if (status === "Moderate") return "bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold";
    if (status === "Good") return "bg-green-100 text-green-700 px-2 py-1 rounded font-semibold";
    return "";
    }
    
    export function LiveMonitoring() {
    return (
        <div className="bg-white rounded-md p-2">
            <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-[500]">Patient Status</span>
                <SearchBar />
            </div>
            <Table className="w-full">
                <TableHeader>
                    <TableRow className="bg-[#D6D7F5] rounded-md">
                        <TableHead className="w-[100px]">Patient Name</TableHead>
                        <TableHead>Age (Months)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Doctor Name</TableHead>
                        <TableHead className="text-right">Last Updated</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {patients.map((patient, idx) => (
                        <TableRow key={patient.patient + patient.doctor + idx}>
                            <TableCell className="font-medium">{patient.patient}</TableCell>
                            <TableCell>{patient.age}</TableCell>
                            <TableCell>
                                <span className={getStatusClass(patient.status)}>
                                    {patient.status}
                                </span>
                            </TableCell>
                            <TableCell>{patient.doctor}</TableCell>
                            <TableCell className="text-right flex items-center justify-end gap-2">
                                {patient.updated === "Live" ? (
                                    <Circle className="h-3 w-3 text-green-500 animate-pulse" />
                                ) : (
                                    <Clock className="h-3 w-3 text-gray-400" />
                                )}
                                <span>{patient.updated}</span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
    }
