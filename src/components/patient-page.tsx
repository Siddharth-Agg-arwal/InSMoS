import { Button } from "@/components/ui/button";

export function PatientPage({
patientId,
onClose,
patients,
}: {
patientId: number;
onClose: () => void;
patients: any[];
}) {
const patient = patients.find((p) => p.id === patientId);

if (!patient) return null;

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{patient.patient}</h2>
        <Button variant="ghost" onClick={onClose}>
            Close
        </Button>
        </div>
        <div className="mb-2">
        <span className="font-semibold">Age:</span> {patient.age}
        </div>
        <div className="mb-2">
        <span className="font-semibold">Status:</span> {patient.status}
        </div>
        <div className="mb-2">
        <span className="font-semibold">Doctor:</span> {patient.doctor}
        </div>
        <div className="mb-2">
        <span className="font-semibold">Last Updated:</span> {patient.updated}
        </div>
        <div className="mb-2">
        <span className="font-semibold">Details:</span> {patient.details}
        </div>
    </div>
    </div>
);
}