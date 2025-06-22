import asyncio
import json
import logging

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

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            logger.info("Connected to MQTT Broker!")
            self.client.subscribe(self.topic)
        else:
            logger.error(f"Failed to connect, return code {rc}\n")

    def on_message(self, client, userdata, msg):
        logger.info(f"Received message from topic {msg.topic}: {msg.payload.decode()}")
        try:
            eeg_data_in = schemas.EEGDataCreate(**json.loads(msg.payload.decode()))
            crud.eeg_data.create(db=self.db, obj_in=eeg_data_in)
            logger.info(f"Stored EEG data: {eeg_data_in}")

            # Send live data to the specific patient's websocket
            patient_id = eeg_data_in.patient_id
            eeg_data_dict = eeg_data_in.model_dump()
            eeg_data_dict['timestamp'] = eeg_data_dict['timestamp'].isoformat()
            asyncio.run(manager.send_to_patient(eeg_data_dict, patient_id))

            # if detect_seizure(eeg_data_in.channel_data):
            #     asyncio.run(
            #         manager.broadcast_alert(
            #             f"Seizure Alert for patient {eeg_data_in.patient_id}"
            #         )
            #     )

        except Exception as e:
            logger.error(f"Error processing message: {e}")

    def start(self):
        self.client.connect(self.host, self.port)
        self.client.loop_start()

    def stop(self):
        self.client.loop_stop()
