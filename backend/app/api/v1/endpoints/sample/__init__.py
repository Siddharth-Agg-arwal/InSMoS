from .iot import router as iot
from .sample_data import router as sample_data
from fastapi import APIRouter

arouter = APIRouter()

arouter.include_router(iot, prefix="/simulate", tags=["iot"])
arouter.include_router(sample_data, prefix="/doc_patient", tags=["sample"])