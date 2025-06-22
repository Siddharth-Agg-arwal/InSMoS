import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    } from "@/components/ui/table"
    import { Circle, Clock, CalendarX2 } from "lucide-react"
    import SearchBar from "./search-bar";
    import AddAppointmentsButton from "./appointments-button";
    
    const appointments = [
    {
        patient: "Sid",
        doctor: "Dr. Smith",
        date : "10/10/2025",
        time: "10:00 AM",
        status: "Confirmed",
    },
    {
        patient: "Sid",
        doctor: "Dr. Smith",
        date : "10/10/2025",
        time: "10:00 AM",
        status: "Cancelled",
    },
    {
        patient: "Sid",
        doctor: "Dr. Smith",
        date : "10/10/2025",
        time: "10:00 AM",
        status: "Confirmed",

    },
    {
        patient: "Sid",
        doctor: "Dr. Smith",
        date : "10/10/2025",
        time: "10:00 AM",
        status: "Pending",

    },
    {
        patient: "Sid",
        doctor: "Dr. Smith",
        date : "10/10/2025",
        time: "10:00 AM",
        status: "Cancelled",

    },
    {
        patient: "Sid",
        doctor: "Dr. Smith",
        date : "10/10/2025",
        time: "10:00 AM",
        status: "Pending",
    },
    ]
    
    function getStatusClass(status: string) {
    if (status === "Cancelled") return "flex justify-center items-center bg-red-100 text-red-700 px-2 py-1 rounded font-semibold";
    if (status === "Pending") return "flex justify-center items-center bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold";
    if (status === "Confirmed") return "flex justify-center items-center bg-green-100 text-green-700 px-2 py-1 rounded font-semibold";
    return "";
    }
    
    export function AppointmentsTable() {
    return (
        <div className="bg-white rounded-md p-2">
            <div className="flex items-center justify-between mb-4">
                <div><span className="text-lg font-[500]">Appointments</span></div>
                <div className="flex items-center gap-4">
                    <SearchBar />
                    <AddAppointmentsButton />
                </div>
            </div>
            <Table className="w-full">
                <TableHeader>
                    <TableRow className="bg-[#D6D7F5] rounded-md">
                        <TableHead className="w-[100px]">Appointee</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appointments.map((appointments, idx) => (
                        <TableRow key={appointments.patient + appointments.doctor + idx}>
                            <TableCell className="font-medium">{appointments.patient}</TableCell>
                            <TableCell>{appointments.doctor}</TableCell>
                            <TableCell>
                                {/* <span className={getStatusClass(appointments.status)}> */}
                                    {appointments.date}
                                {/* </span> */}
                            </TableCell>
                            <TableCell>{appointments.time}</TableCell>
                            <TableCell className="text-right flex items-center justify-end gap-2">
                                <span className={getStatusClass(appointments.status)}>
                                    {appointments.status === "Pending" ? (
                                        <Clock className="h-3 w-3 text-black animate-pulse m-1" />
                                    ) : appointments.status === "Confirmed" ? (
                                        <Circle className="h-3 w-3 text-green-500 animate-pulse m-1" />
                                    ) : appointments.status === "Cancelled" ? (
                                        <CalendarX2 className="h-3 w-3 text-red-500 m-1" />
                                    ) : null}
                                    {appointments.status}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
    }
