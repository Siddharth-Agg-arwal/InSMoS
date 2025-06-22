from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=schemas.Patient)
def create_sample_data(
    db: Session = Depends(deps.get_db),
):
    """
    Create a sample doctor and patient.
    """
    doctor_in = schemas.DoctorCreate(name="Dr. John Doe", specialty="Neurologist")
    doctor = crud.doctor.create(db=db, obj_in=doctor_in)
    patient_in = schemas.PatientCreate(
        name="Jane Doe", age=30, doctor_id=doctor.id, status="stable"
    )
    patient = crud.patient.create(db=db, obj_in=patient_in)
    return patient
