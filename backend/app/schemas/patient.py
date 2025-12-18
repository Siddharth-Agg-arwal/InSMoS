from pydantic import BaseModel
from typing import Optional

class PatientBase(BaseModel):
    name: str
    age: int
    doctor_id: int
    status: str = "Good"
    condition: Optional[str] = "Epilepsy"
    blood_type: Optional[str] = None
    seizure_frequency: Optional[str] = None
    medication: Optional[str] = None
    guardian: Optional[str] = None
    contact: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class PatientUpdate(PatientBase):
    pass

class Patient(PatientBase):
    id: int

    class Config:
        from_attributes = True
