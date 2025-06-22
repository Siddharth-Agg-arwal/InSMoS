from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    status = Column(String, default="Good")

    doctor = relationship("Doctor", back_populates="patients")
    sessions = relationship("Session", back_populates="patient")

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    specialty = Column(String)

    patients = relationship("Patient", back_populates="doctor")

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
