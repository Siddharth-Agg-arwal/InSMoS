from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.post("/", response_model=schemas.Doctor)
def create_doctor(
    *, db: Session = Depends(deps.get_db), doctor_in: schemas.DoctorCreate
):
    doctor = crud.doctor.create(db=db, obj_in=doctor_in)
    return doctor


@router.get("/", response_model=List[schemas.Doctor])
def read_doctors(
    db: Session = Depends(deps.get_db), skip: int = 0, limit: int = 100
):
    doctors = crud.doctor.get_multi(db, skip=skip, limit=limit)
    return doctors
