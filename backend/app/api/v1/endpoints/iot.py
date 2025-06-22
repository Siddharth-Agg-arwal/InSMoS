import asyncio
import random
import json
from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import paho.mqtt.client as mqtt
from app.schemas.eeg_data import EEGDataCreate

router = APIRouter()

# MQTT client setup
mqtt_client = mqtt.Client()

def connect_mqtt():
    """Connect to the MQTT broker."""
    try:
        mqtt_client.connect("localhost", 1883)
        mqtt_client.loop_start()
        print("Connected to MQTT Broker for simulation.")
    except Exception as e:
        print(f"Could not connect to MQTT Broker: {e}")

def disconnect_mqtt():
    """Disconnect from the MQTT broker."""
    mqtt_client.loop_stop()
    mqtt_client.disconnect()
    print("Disconnected from MQTT Broker.")

@router.websocket("/ws/simulate")
async def simulate_eeg_data_stream(websocket: WebSocket):
    """
    Simulates a live stream of EEG data from an IoT device.
    Connect to this WebSocket to trigger the simulation. The generated data
    is published to the 'eeg/data' MQTT topic and also streamed to the
    WebSocket client for real-time viewing.
    """
    await websocket.accept()
    connect_mqtt()
    
    try:
        while True:
            # Generate random EEG data conforming to the schema
            eeg_data = EEGDataCreate(
                patient_id=2,
                timestamp=datetime.now(),
                channel_data=[random.uniform(-100.0, 100.0) for _ in range(8)]
            )
            
            # The schema expects a string timestamp for JSON serialization
            eeg_data_dict = eeg_data.model_dump()
            eeg_data_dict['timestamp'] = eeg_data_dict['timestamp'].isoformat()
            eeg_data_json = json.dumps(eeg_data_dict)
            # Publish to the MQTT topic for the backend to process
            mqtt_client.publish("eeg/data", eeg_data_json)
            
            # Send the same data to the WebSocket client for visibility
            await websocket.send_text(eeg_data_json)
            
            # Wait for 1 second to simulate a real-time interval
            await asyncio.sleep(1)
            
    except WebSocketDisconnect:
        print("Client disconnected from simulation.")
    finally:
        disconnect_mqtt()
