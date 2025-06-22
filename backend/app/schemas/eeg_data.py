from pydantic import BaseModel
from datetime import datetime
from typing import List

class EEGDataBase(BaseModel):
    channel_data: List[float]
    timestamp: datetime

class EEGDataCreate(EEGDataBase):
    patient_id: int

class EEGData(EEGDataBase):
    class Config:
        from_attributes = True

class EEGDataUpdate(EEGDataBase):
    pass
