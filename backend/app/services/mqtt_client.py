import asyncio
import json
import logging
from concurrent.futures import ThreadPoolExecutor

import paho.mqtt.client as mqtt
from sqlalchemy.orm import Session

from app import crud, schemas
from app.services.seizure_detection import detect_seizure
from app.websockets.manager import manager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MQTTClient:
    def __init__(self, host: str, port: int, db: Session, topic: str = "eeg/data"):
        self.host = host
        self.port = port
        self.db = db
        self.topic = topic
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.loop = None
        self.executor = ThreadPoolExecutor(max_workers=1)

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            logger.info("Connected to MQTT Broker!")
            self.client.subscribe(self.topic)
        else:
            logger.error(f"Failed to connect, return code {rc}\n")

    def on_message(self, client, userdata, msg):
        try:
            eeg_data_in = schemas.EEGDataCreate(**json.loads(msg.payload.decode()))

            # Send live data to the specific patient's websocket
            patient_id = eeg_data_in.patient_id
            eeg_data_dict = eeg_data_in.model_dump()
            eeg_data_dict['timestamp'] = eeg_data_dict['timestamp'].isoformat()
            
            # Schedule the coroutine in the existing event loop without blocking
            if self.loop and not self.loop.is_closed():
                asyncio.run_coroutine_threadsafe(
                    manager.send_to_patient(eeg_data_dict, patient_id),
                    self.loop
                )

        except Exception as e:
            logger.error(f"Error processing message: {e}")

    def start(self):
        # Get the running event loop
        try:
            self.loop = asyncio.get_running_loop()
        except RuntimeError:
            self.loop = asyncio.new_event_loop()
            asyncio.set_event_loop(self.loop)
        
        self.client.connect(self.host, self.port)
        self.client.loop_start()
        logger.info(f"MQTT Client started and subscribed to {self.topic}")

    def stop(self):
        self.client.loop_stop()
        self.client.disconnect()
        self.executor.shutdown(wait=True)
        logger.info("MQTT Client stopped")
