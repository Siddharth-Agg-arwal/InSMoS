from fastapi import FastAPI
from app.api.v1.api import api_router
from app.core.config import settings
from contextlib import asynccontextmanager
from app.api.deps import get_db
from app.services.mqtt_client import MQTTClient

@asynccontextmanager
async def lifespan(app: FastAPI):
    db = next(get_db())
    mqtt_client = MQTTClient(host="localhost", port=1883, db=db)
    mqtt_client.start()
    yield
    mqtt_client.stop()

app = FastAPI(lifespan=lifespan)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"Hello": "World"}
