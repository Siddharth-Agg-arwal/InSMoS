import { useState } from "react"
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
import { Clock } from "lucide-react"
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

const REASONS = [
"Routine checkup",
"Consultation",
"Follow-up",
"Lab Results",
"Vaccination",
"Other",
]

const DOCTORS = [
"Dr. Smith",
"Dr. Lee",
"Dr. Patel",
"Dr. Adams",
"Not in list",
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
const [isNewPatient, setIsNewPatient] = useState(false)
const [date, setDate] = useState<Date | null>(null)
const [time, setTime] = useState<string>("")
const [reason, setReason] = useState<string>("")
const [otherReason, setOtherReason] = useState<string>("")
const [doctor, setDoctor] = useState<string>("")
const [otherDoctor, setOtherDoctor] = useState<string>("")

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
            <form
            onSubmit={e => {
                e.preventDefault()
                if (onConfirm) {
                onConfirm({
                    patientName: e.currentTarget.patientName.value,
                    patientId: e.currentTarget.patientId.value,
                    isNewPatient,
                    age: e.currentTarget.age.value,
                    date,
                    time,
                    doctor: doctor === "Not in list" ? otherDoctor : doctor,
                    reason: reason === "Other" ? otherReason : reason,
                    notes: e.currentTarget.notes.value,
                })
                }
            }}
            >
            <div className="flex flex-col gap-6">
                {/* Name of patient */}
                <div className="grid gap-3">
                <Label htmlFor="patientName">Name of Patient</Label>
                <Input id="patientName" name="patientName" required />
                </div>
                {/* Patient ID with checkbox */}
                <div className="grid gap-3">
                <div className="flex items-center gap-2">
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Checkbox
                    id="newPatient"
                    checked={isNewPatient}
                    onCheckedChange={checked => setIsNewPatient(!!checked)}
                    />
                    <span className="text-sm">New patient</span>
                </div>
                <Input
                    id="patientId"
                    name="patientId"
                    disabled={isNewPatient}
                    placeholder={isNewPatient ? "Auto-generated for new patient" : ""}
                    required={!isNewPatient}
                />
                </div>
                {/* Age of patient */}
                <div className="grid gap-3">
                <Label htmlFor="age">Age of Patient</Label>
                <Input id="age" name="age" type="number" min={0} required />
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
                <Select
                    value={doctor}
                    onValueChange={setDoctor}
                    required
                >
                    <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                    {DOCTORS.map(d => (
                        <SelectItem key={d} value={d}>
                        {d}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                {doctor === "Not in list" && (
                    <Input
                    className="mt-2"
                    placeholder="Enter doctor's name"
                    value={otherDoctor}
                    onChange={e => setOtherDoctor(e.target.value)}
                    required
                    />
                )}
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
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">Confirm</Button>
                </div>
            </div>
            </form>
        </CardContent>
        </Card>
    </div>
    </div>
)
}
