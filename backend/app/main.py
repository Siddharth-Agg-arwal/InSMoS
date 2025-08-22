from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings
from contextlib import asynccontextmanager
from app.api.deps import get_db
from sqlalchemy import create_engine, text
from app.core.config import settings as app_settings
from app.services.mqtt_client import MQTTClient
from app.services.analysis_service import run_analysis, extract_eeg_line_series
import tempfile, shutil, os

@asynccontextmanager
async def lifespan(app: FastAPI):
    mqtt_client = None
    try:
        db = next(get_db())
        mqtt_client = MQTTClient(host="localhost", port=1883, db=db)
        mqtt_client.start()
        # DB connectivity check
        try:
            engine = create_engine(app_settings.DATABASE_URL, pool_pre_ping=True)
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print("[INFO] Database connection successful")
        except Exception as db_e:
            print(f"[ERROR] Database connection failed: {db_e}")
    except Exception as e:
        print(f"[WARN] MQTT not started: {e}")
    yield
    if mqtt_client:
        try:
            mqtt_client.stop()
        except Exception:
            pass

app = FastAPI(lifespan=lifespan)

# CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/analyze-excel")
async def analyze_excel(file: UploadFile = File(...)):
    # Save uploaded file to a temp path
    suffix = os.path.splitext(file.filename or "upload")[1]
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
        result = run_analysis(tmp_path)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        try:
            file.file.close()
        except:
            pass
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.post("/analyze-eeg-lines")
async def analyze_eeg_lines(file: UploadFile = File(...), prefix: str = Query("eeg_"), max_points: int = Query(1000, ge=100, le=10000)):
    suffix = os.path.splitext(file.filename or "upload")[1]
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
        result = extract_eeg_line_series(tmp_path, prefix=prefix, max_points=max_points)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        try:
            file.file.close()
        except:
            pass
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.remove(tmp_path)
