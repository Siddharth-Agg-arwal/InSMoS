import json
import random
import time
from datetime import datetime
import paho.mqtt.client as mqtt

client = mqtt.Client()
client.connect("localhost", 1883)

try:
    while True:
        data = {
            "patient_id": 1,
            "timestamp": datetime.now().isoformat(),
            "channel_data": [random.uniform(-100.0, 100.0) for _ in range(8)]
        }
        client.publish("eeg/data", json.dumps(data))
        print(f"Published: {data['timestamp']}")
        time.sleep(1/10)  # ~0.0039 seconds between readings
except KeyboardInterrupt:
    client.disconnect()