from fastapi import APIRouter

from app.api.v1.endpoints import doctor, patient, ws,iot

api_router = APIRouter()
api_router.include_router(doctor.router, prefix="/doctors", tags=["doctors"])
api_router.include_router(patient.router, prefix="/patients", tags=["patients"])
api_router.include_router(ws.router, prefix="/ws", tags=["websockets"])
api_router.include_router(iot.router, prefix="/iot", tags=["iot"])
