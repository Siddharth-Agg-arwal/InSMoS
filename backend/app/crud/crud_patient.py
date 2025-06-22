from app.crud.base import CRUDBase
from app.models.models import Patient
from app.schemas.patient import PatientCreate, PatientUpdate


class CRUDPatient(CRUDBase[Patient, PatientCreate, PatientUpdate]):
    pass


patient = CRUDPatient(Patient)
