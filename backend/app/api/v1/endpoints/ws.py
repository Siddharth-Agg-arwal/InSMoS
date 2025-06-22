from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websockets.manager import manager

router = APIRouter()


@router.websocket("/ws/seizure_alerts")
async def websocket_seizure_alerts(websocket: WebSocket):
    await manager.connect_alert(websocket)
    try:
        while True:
            # This connection is for receiving alerts, not for sending data from client
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_alert(websocket)


@router.websocket("/ws/live_eeg/{patient_id}")
async def websocket_live_eeg(websocket: WebSocket, patient_id: int):
    await manager.connect_patient(websocket, patient_id)
    try:
        while True:
            # This connection is for receiving data, not for sending it from the client
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_patient(websocket, patient_id)
