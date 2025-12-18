from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings
from contextlib import asynccontextmanager
from app.api.deps import get_db
from app.services.mqtt_client import MQTTClient
from fastapi.staticfiles import StaticFiles

@asynccontextmanager
async def lifespan(app: FastAPI):
    db = next(get_db())
    mqtt_client = MQTTClient(host="localhost", port=1883, db=db)
    mqtt_client.start()
    yield
    mqtt_client.stop()

app = FastAPI(lifespan=lifespan)

# Add CORS middleware to allow WebSocket connections from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="../public"), name="static")

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"Hello": "World"}
