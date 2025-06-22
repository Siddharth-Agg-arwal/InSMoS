from typing import Dict, List
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.patient_connections: Dict[int, List[WebSocket]] = {}
        self.alert_connections: List[WebSocket] = []

    async def connect_patient(self, websocket: WebSocket, patient_id: int):
        await websocket.accept()
        if patient_id not in self.patient_connections:
            self.patient_connections[patient_id] = []
        self.patient_connections[patient_id].append(websocket)

    def disconnect_patient(self, websocket: WebSocket, patient_id: int):
        if patient_id in self.patient_connections and websocket in self.patient_connections[patient_id]:
            self.patient_connections[patient_id].remove(websocket)
            if not self.patient_connections[patient_id]:
                del self.patient_connections[patient_id]

    async def send_to_patient(self, message: str, patient_id: int):
        if patient_id in self.patient_connections:
            for connection in self.patient_connections[patient_id]:
                await connection.send_json(message)

    async def connect_alert(self, websocket: WebSocket):
        await websocket.accept()
        self.alert_connections.append(websocket)

    def disconnect_alert(self, websocket: WebSocket):
        self.alert_connections.remove(websocket)

    async def broadcast_alert(self, message: str):
        for connection in self.alert_connections:
            await connection.send_text(message)


manager = ConnectionManager()
