from pydantic import BaseModel
from typing import Optional
from datetime import date, time, datetime


class AppointmentBase(BaseModel):
    patient_id: int
    patient_name: str
    is_new_patient: bool = False
    patient_age: Optional[int] = None
    appointment_date: date
    appointment_time: time
    doctor_id: Optional[int] = None
    doctor_name: str
    reason: str
    notes: Optional[str] = None
    status: str = "Scheduled"


class AppointmentCreate(AppointmentBase):
    created_at: datetime


class AppointmentUpdate(BaseModel):
    patient_name: Optional[str] = None
    patient_age: Optional[int] = None
    appointment_date: Optional[date] = None
    appointment_time: Optional[time] = None
    doctor_id: Optional[int] = None
    doctor_name: Optional[str] = None
    reason: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class Appointment(AppointmentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
