from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.api import deps
from app.crud.crud_appointment import crud_appointment
from app.schemas.appointment import Appointment, AppointmentCreate, AppointmentUpdate

router = APIRouter()


@router.get("/", response_model=List[Appointment])
def read_appointments(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> List[Appointment]:
    """
    Retrieve all appointments.
    """
    appointments = crud_appointment.get_multi(db, skip=skip, limit=limit)
    return appointments


@router.get("/upcoming", response_model=List[Appointment])
def read_upcoming_appointments(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> List[Appointment]:
    """
    Retrieve upcoming appointments.
    """
    appointments = crud_appointment.get_upcoming(db, skip=skip, limit=limit)
    return appointments


@router.get("/patient/{patient_id}", response_model=List[Appointment])
def read_appointments_by_patient(
    patient_id: int,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> List[Appointment]:
    """
    Retrieve appointments by patient ID.
    """
    appointments = crud_appointment.get_by_patient_id(db, patient_id=patient_id, skip=skip, limit=limit)
    return appointments


@router.get("/doctor/{doctor_id}", response_model=List[Appointment])
def read_appointments_by_doctor(
    doctor_id: int,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> List[Appointment]:
    """
    Retrieve appointments by doctor ID.
    """
    appointments = crud_appointment.get_by_doctor_id(db, doctor_id=doctor_id, skip=skip, limit=limit)
    return appointments


@router.get("/{appointment_id}", response_model=Appointment)
def read_appointment(
    appointment_id: int,
    db: Session = Depends(deps.get_db),
) -> Appointment:
    """
    Get appointment by ID.
    """
    appointment = crud_appointment.get(db, id=appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment


@router.post("/", response_model=Appointment)
def create_appointment(
    *,
    db: Session = Depends(deps.get_db),
    appointment_in: AppointmentCreate,
) -> Appointment:
    """
    Create new appointment.
    """
    # Add created_at timestamp if not provided
    if not hasattr(appointment_in, 'created_at') or appointment_in.created_at is None:
        appointment_data = appointment_in.model_dump()
        appointment_data['created_at'] = datetime.now()
        appointment = crud_appointment.create(db, obj_in=appointment_data)
    else:
        appointment = crud_appointment.create(db, obj_in=appointment_in)
    return appointment


@router.put("/{appointment_id}", response_model=Appointment)
def update_appointment(
    *,
    db: Session = Depends(deps.get_db),
    appointment_id: int,
    appointment_in: AppointmentUpdate,
) -> Appointment:
    """
    Update an appointment.
    """
    appointment = crud_appointment.get(db, id=appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appointment = crud_appointment.update(db, db_obj=appointment, obj_in=appointment_in)
    return appointment


@router.delete("/{appointment_id}")
def delete_appointment(
    *,
    db: Session = Depends(deps.get_db),
    appointment_id: int,
) -> dict:
    """
    Delete an appointment.
    """
    appointment = crud_appointment.get(db, id=appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    crud_appointment.remove(db, id=appointment_id)
    return {"message": "Appointment deleted successfully"}
