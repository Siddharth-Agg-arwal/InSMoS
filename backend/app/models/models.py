from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Date, Time, Text, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    status = Column(String, default="Good")
    condition = Column(String, default="Epilepsy")
    blood_type = Column(String)
    seizure_frequency = Column(String)
    medication = Column(String)
    guardian = Column(String)
    contact = Column(String)

    doctor = relationship("Doctor", back_populates="patients")
    sessions = relationship("Session", back_populates="patient")
    appointments = relationship("Appointment", back_populates="patient")

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    specialty = Column(String)

    patients = relationship("Patient", back_populates="doctor")
    appointments = relationship("Appointment", back_populates="doctor")

class Session(Base):
    __tablename__ = "notable_sessions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    duration = Column(Float)
    notes = Column(String)

    patient = relationship("Patient", back_populates="sessions")

class EEGData(Base):
    __tablename__ = "eeg_data"

    time = Column(DateTime(timezone=True), primary_key=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), primary_key=True)
    channel_id = Column(Integer, primary_key=True)
    voltage_mv = Column(Float, nullable=False)

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    patient_name = Column(String, nullable=False)
    is_new_patient = Column(Boolean, default=False)
    patient_age = Column(Integer)
    appointment_date = Column(Date, nullable=False)
    appointment_time = Column(Time, nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    doctor_name = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    notes = Column(Text)
    status = Column(String, default="Scheduled")  # Scheduled, Completed, Cancelled
    created_at = Column(DateTime, nullable=False)

    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")
