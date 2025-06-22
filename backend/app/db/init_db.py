import logging
from sqlalchemy import create_engine
from app.db.base import Base
from app.models import models

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db(db_url: str) -> None:
    try:
        engine = create_engine(db_url)
        Base.metadata.create_all(bind=engine)
        logger.info("Database initialized")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise
