from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.models import Appointment
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate


class CRUDAppointment(CRUDBase[Appointment, AppointmentCreate, AppointmentUpdate]):
    def get_by_patient_id(
        self, db: Session, *, patient_id: int, skip: int = 0, limit: int = 100
    ) -> List[Appointment]:
        return (
            db.query(self.model)
            .filter(Appointment.patient_id == patient_id)
            .order_by(Appointment.appointment_date.desc(), Appointment.appointment_time.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_doctor_id(
        self, db: Session, *, doctor_id: int, skip: int = 0, limit: int = 100
    ) -> List[Appointment]:
        return (
            db.query(self.model)
            .filter(Appointment.doctor_id == doctor_id)
            .order_by(Appointment.appointment_date.desc(), Appointment.appointment_time.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_status(
        self, db: Session, *, status: str, skip: int = 0, limit: int = 100
    ) -> List[Appointment]:
        return (
            db.query(self.model)
            .filter(Appointment.status == status)
            .order_by(Appointment.appointment_date.desc(), Appointment.appointment_time.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_upcoming(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Appointment]:
        from datetime import date
        return (
            db.query(self.model)
            .filter(Appointment.appointment_date >= date.today())
            .filter(Appointment.status == "Scheduled")
            .order_by(Appointment.appointment_date.asc(), Appointment.appointment_time.asc())
            .offset(skip)
            .limit(limit)
            .all()
        )


crud_appointment = CRUDAppointment(Appointment)
