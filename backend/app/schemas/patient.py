from pydantic import BaseModel

class PatientBase(BaseModel):
    name: str
    age: int
    doctor_id: int
    status: str

class PatientCreate(PatientBase):
    pass

class PatientUpdate(PatientBase):
    pass

class Patient(PatientBase):
    id: int

    class Config:
        from_attributes = True
