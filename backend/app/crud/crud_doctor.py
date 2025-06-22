from app.crud.base import CRUDBase
from app.models.models import Doctor
from app.schemas.doctor import DoctorCreate, DoctorUpdate


class CRUDDoctor(CRUDBase[Doctor, DoctorCreate, DoctorUpdate]):
    pass

doctor = CRUDDoctor(Doctor)
