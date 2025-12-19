import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Clock, Loader2 } from "lucide-react"
import { format } from "date-fns"
import {
Popover,
PopoverContent,
PopoverTrigger,
} from "@/components/ui/popover"
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"

const API_BASE_URL = "http://localhost:8000/api/v1"

interface Patient {
    id: number;
    name: string;
    age: number;
    doctor_id: number;
    status: string;
}

interface Doctor {
    id: number;
    name: string;
}

const REASONS = [
"Routine checkup",
"Consultation",
"Follow-up",
"Lab Results",
"Vaccination",
"Other",
]

export function AppointmentForm({
className,
onCancel,
onConfirm,
...props
}: React.ComponentProps<"div"> & {
onCancel?: () => void
onConfirm?: (data: any) => void
}) {
const [patients, setPatients] = useState<Patient[]>([])
const [doctors, setDoctors] = useState<Doctor[]>([])
const [selectedPatientId, setSelectedPatientId] = useState<string>("")
const [isNewPatient, setIsNewPatient] = useState(false)
const [patientName, setPatientName] = useState("")
const [patientAge, setPatientAge] = useState("")
const [date, setDate] = useState<Date | null>(null)
const [time, setTime] = useState<string>("")
const [reason, setReason] = useState<string>("")
const [otherReason, setOtherReason] = useState<string>("")
const [selectedDoctorId, setSelectedDoctorId] = useState<string>("")
const [submitting, setSubmitting] = useState(false)
const [error, setError] = useState<string | null>(null)

// Fetch patients and doctors on mount
useEffect(() => {
    async function fetchData() {
        try {
            const [patientsRes, doctorsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/patients/`),
                fetch(`${API_BASE_URL}/doctors/`),
            ]);
            if (patientsRes.ok) {
                const pData = await patientsRes.json();
                setPatients(pData);
            }
            if (doctorsRes.ok) {
                const dData = await doctorsRes.json();
                setDoctors(dData);
            }
        } catch (err) {
            console.error("Failed to fetch patients/doctors", err);
        }
    }
    fetchData();
}, []);

// When patient is selected, auto-fill name and age
useEffect(() => {
    if (selectedPatientId && !isNewPatient) {
        const patient = patients.find(p => p.id.toString() === selectedPatientId);
        if (patient) {
            setPatientName(patient.name);
            setPatientAge(patient.age?.toString() || "");
        }
    }
}, [selectedPatientId, patients, isNewPatient]);

// When new patient checkbox changes, clear selection
useEffect(() => {
    if (isNewPatient) {
        setSelectedPatientId("");
        setPatientName("");
        setPatientAge("");
    }
}, [isNewPatient]);

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const form = e.currentTarget
    const notes = (form.elements.namedItem("notes") as HTMLTextAreaElement).value
    const finalReason = reason === "Other" ? otherReason : reason
    
    const selectedDoctor = doctors.find(d => d.id.toString() === selectedDoctorId);
    const doctorName = selectedDoctor?.name || "";

    let patientId = parseInt(selectedPatientId, 10);

    try {
        // If new patient, create patient first
        if (isNewPatient) {
            if (!selectedDoctorId) {
                throw new Error("Please select a doctor for the new patient");
            }
            const patientPayload = {
                name: patientName,
                age: parseInt(patientAge, 10),
                doctor_id: parseInt(selectedDoctorId, 10),
                status: "Good",
                condition: "Epilepsy",
            };
            const patientRes = await fetch(`${API_BASE_URL}/patients/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patientPayload),
            });
            if (!patientRes.ok) {
                const errData = await patientRes.json().catch(() => ({}));
                throw new Error(errData.detail || "Failed to create patient");
            }
            const newPatient = await patientRes.json();
            patientId = newPatient.id;
        }

        // Build appointment payload
        const payload = {
            patient_id: patientId,
            patient_name: patientName,
            is_new_patient: isNewPatient,
            patient_age: patientAge ? parseInt(patientAge, 10) : null,
            appointment_date: date ? format(date, "yyyy-MM-dd") : "",
            appointment_time: time + ":00",
            doctor_id: selectedDoctorId ? parseInt(selectedDoctorId, 10) : null,
            doctor_name: doctorName,
            reason: finalReason,
            notes: notes || null,
            status: "Pending",
            created_at: new Date().toISOString(),
        }

        const res = await fetch(`${API_BASE_URL}/appointments/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}))
            throw new Error(errData.detail || "Failed to create appointment")
        }

        const created = await res.json()
        if (onConfirm) onConfirm(created)
    } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
        setSubmitting(false)
    }
}

return (
    <div
    className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        className
    )}
    style={{ background: "rgba(0,0,0,0.25)" }}
    {...props}
    >
    <div className="w-[40vw]">
        <Card>
        <CardHeader>
            <CardTitle>New Appointment</CardTitle>
            <CardDescription>
            Fill in the details to schedule a new appointment.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit}>
            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                    {error}
                </div>
            )}
            <div className="flex flex-col gap-6">
                {/* Patient Selection or New Patient */}
                <div className="grid gap-3">
                    <div className="flex items-center gap-2">
                        <Label>Patient</Label>
                        <Checkbox
                            id="newPatient"
                            checked={isNewPatient}
                            onCheckedChange={checked => setIsNewPatient(!!checked)}
                        />
                        <span className="text-sm">New patient</span>
                    </div>
                    {!isNewPatient ? (
                        <Select value={selectedPatientId} onValueChange={setSelectedPatientId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select existing patient" />
                            </SelectTrigger>
                            <SelectContent>
                                {patients.map(p => (
                                    <SelectItem key={p.id} value={p.id.toString()}>
                                        {p.name} (ID: {p.id})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <Input
                            placeholder="Enter patient name"
                            value={patientName}
                            onChange={e => setPatientName(e.target.value)}
                            required
                        />
                    )}
                </div>
                {/* Age of patient */}
                <div className="grid gap-3">
                    <Label htmlFor="age">Age of Patient</Label>
                    <Input
                        id="age"
                        name="age"
                        type="number"
                        min={0}
                        value={patientAge}
                        onChange={e => setPatientAge(e.target.value)}
                        disabled={!isNewPatient && !!selectedPatientId}
                        required
                    />
                </div>
                {/* Date and time of appointment */}
                <div className="grid gap-3">
                <Label>Date and Time of Appointment</Label>
                <div className="flex gap-2">
                    {/* Date Picker */}
                    <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant="outline"
                        className={cn(
                            "w-[160px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        type="button"
                        >
                        <span>
                            {date ? format(date, "PPP") : "Pick a date"}
                        </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        required={true}
                        selected={date ?? undefined}
                        onSelect={setDate}
                        initialFocus
                        />
                    </PopoverContent>
                    </Popover>
                    {/* Time Picker (simple input with clock icon) */}
                    <div className="relative">
                    <Input
                        type="time"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                        className="pr-8"
                        required
                    />
                    <Clock className="absolute right-2 top-2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
                </div>
                {/* Doctor dropdown */}
                <div className="grid gap-3">
                    <Label htmlFor="doctor">Doctor</Label>
                    <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                            {doctors.map(d => (
                                <SelectItem key={d.id} value={d.id.toString()}>
                                    {d.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {/* Reason for appointment */}
                <div className="grid gap-3">
                <Label htmlFor="reason">Reason for Appointment</Label>
                <Select
                    value={reason}
                    onValueChange={setReason}
                    required
                >
                    <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                    {REASONS.map(r => (
                        <SelectItem key={r} value={r}>
                        {r}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                {reason === "Other" && (
                    <Input
                    className="mt-2"
                    placeholder="Enter reason"
                    value={otherReason}
                    onChange={e => setOtherReason(e.target.value)}
                    required
                    />
                )}
                </div>
                {/* Notes */}
                <div className="grid gap-3">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" rows={3} />
                </div>
                {/* Confirm and Cancel buttons */}
                <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                    {submitting ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</>
                    ) : (
                        "Confirm"
                    )}
                </Button>
                </div>
            </div>
            </form>
        </CardContent>
        </Card>
    </div>
    </div>
)
}
