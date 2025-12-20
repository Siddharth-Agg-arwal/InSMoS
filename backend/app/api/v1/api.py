from fastapi import APIRouter

from app.api.v1.endpoints import doctor, patient, ws, appointment, session
from app.api.v1.endpoints.sample import arouter

api_router = APIRouter()
api_router.include_router(doctor.router, prefix="/doctors", tags=["doctors"])
api_router.include_router(patient.router, prefix="/patients", tags=["patients"])
api_router.include_router(appointment.router, prefix="/appointments", tags=["appointments"])
api_router.include_router(session.router, prefix="/sessions", tags=["sessions"])
api_router.include_router(ws.router, prefix="/ws", tags=["websockets"])
api_router.include_router(arouter, prefix="/sample", tags=["sample"])
