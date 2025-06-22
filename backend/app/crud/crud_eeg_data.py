from app.crud.base import CRUDBase
from app.models.models import EEGData
from app.schemas.eeg_data import EEGDataCreate, EEGDataUpdate
from sqlalchemy.orm import Session

class CRUDEEGData(CRUDBase[EEGData, EEGDataCreate, EEGDataUpdate]):
    def create(self, db: Session, *, obj_in: EEGDataCreate) -> EEGData:
        db_objs = []
        for i, voltage in enumerate(obj_in.channel_data):
            db_obj = self.model(
                time=obj_in.timestamp,
                channel_id=i,
                voltage_mv=voltage,
                patient_id=obj_in.patient_id
                )
            db_objs.append(db_obj)
        db.add_all(db_objs)
        db.commit()
        return db_objs[0]


eeg_data = CRUDEEGData(EEGData)
