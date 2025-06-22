from typing import List
import asyncio

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.websockets.manager import manager

router = APIRouter()


@router.post("/", response_model=schemas.Patient)
def create_patient(
    *, db: Session = Depends(deps.get_db), patient_in: schemas.PatientCreate
):
    patient = crud.patient.create(db=db, obj_in=patient_in)
    return patient


@router.get("/", response_model=List[schemas.Patient])
def read_patients(
    db: Session = Depends(deps.get_db), skip: int = 0, limit: int = 100
):
    patients = crud.patient.get_multi(db, skip=skip, limit=limit)
    return patients


@router.put("/{patient_id}", response_model=schemas.Patient)
def update_patient(
    *,
    db: Session = Depends(deps.get_db),
    patient_id: int,
    patient_in: schemas.PatientUpdate,
):
    patient = crud.patient.get(db=db, id=patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    patient = crud.patient.update(db=db, db_obj=patient, obj_in=patient_in)
    asyncio.run(manager.broadcast(f"Patient {patient.id} status updated to {patient.status}"))
    return patient
