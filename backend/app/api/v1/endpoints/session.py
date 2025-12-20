from typing import List
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, desc

from app.api import deps
from app.models.models import Session as NotableSession, Patient

router = APIRouter()


@router.get("/")
def read_sessions(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    sessions = db.query(NotableSession).offset(skip).limit(limit).all()
    return sessions


@router.get("/count/last24h")
def count_sessions_last_24h(
    db: Session = Depends(deps.get_db),
):
    """
    Count seizure sessions detected in the last 24 hours.
    """
    cutoff = datetime.utcnow() - timedelta(hours=24)
    count = db.query(func.count(NotableSession.id)).filter(
        NotableSession.start_time >= cutoff
    ).scalar()
    return {"count": count or 0}


@router.get("/stats")
def get_session_stats(
    db: Session = Depends(deps.get_db),
):
    now = datetime.utcnow()
    last_24h = now - timedelta(hours=24)
    last_7d = now - timedelta(days=7)
    
    count_24h = db.query(func.count(NotableSession.id)).filter(
        NotableSession.start_time >= last_24h
    ).scalar() or 0
    
    count_7d = db.query(func.count(NotableSession.id)).filter(
        NotableSession.start_time >= last_7d
    ).scalar() or 0
    
    total = db.query(func.count(NotableSession.id)).scalar() or 0
    
    return {
        "last_24h": count_24h,
        "last_7d": count_7d,
        "total": total
    }


@router.get("/frequency/monthly")
def get_monthly_seizure_frequency(
    db: Session = Depends(deps.get_db),
    months: int = 6,
):
    """
    Get seizure count per month for the last N months.
    """
    now = datetime.utcnow()
    results = []
    
    for i in range(months - 1, -1, -1):
        # Calculate month boundaries
        target_month = now.month - i
        target_year = now.year
        
        while target_month <= 0:
            target_month += 12
            target_year -= 1
        
        # Get count for this month
        count = db.query(func.count(NotableSession.id)).filter(
            extract('month', NotableSession.start_time) == target_month,
            extract('year', NotableSession.start_time) == target_year
        ).scalar() or 0
        
        # Get month name
        month_name = datetime(target_year, target_month, 1).strftime("%B")
        
        results.append({
            "month": month_name,
            "seizures": count
        })
    
    return results


@router.get("/top-patients")
def get_top_seizure_patients(
    db: Session = Depends(deps.get_db),
    limit: int = 4,
):
    """
    Get patients with the highest number of seizures.
    """
    # Query to count seizures per patient and join with patient name
    results = db.query(
        NotableSession.patient_id,
        Patient.name,
        func.count(NotableSession.id).label('seizure_count')
    ).join(
        Patient, NotableSession.patient_id == Patient.id
    ).group_by(
        NotableSession.patient_id, Patient.name
    ).order_by(
        desc('seizure_count')
    ).limit(limit).all()
    
    return [
        {
            "patient_id": r.patient_id,
            "name": r.name,
            "count": r.seizure_count
        }
        for r in results
    ]


@router.get("/recent")
def get_recent_seizures(
    db: Session = Depends(deps.get_db),
    limit: int = 4,
):
    """
    Get the most recent seizure events with patient names.
    """
    results = db.query(
        NotableSession.id,
        NotableSession.patient_id,
        NotableSession.start_time,
        Patient.name
    ).join(
        Patient, NotableSession.patient_id == Patient.id
    ).order_by(
        desc(NotableSession.start_time)
    ).limit(limit).all()
    
    return [
        {
            "session_id": r.id,
            "patient_id": r.patient_id,
            "name": r.name,
            "time": r.start_time.isoformat() if r.start_time else None
        }
        for r in results
    ]
