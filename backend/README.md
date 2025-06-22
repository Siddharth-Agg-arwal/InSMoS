# InSMoS Backend
### This is the backend for the InSMoS project, which provides a RESTful API for managing and interacting with the InSMoS system.
### It is built using Python and FastAPI, and it uses a Mosquitto broker for MQTT communication. Postgres with TimescaleDB is used for data storage.

## Steps to run the backend:
1. **Clone the repository**:
2. **Start the Postgres, Mosquitto Docker containers**:
```bash
   docker compose up -d
   ```
3. **Install dependencies**:
   ```bash
   make install
   ```
4. **Use virtual env**:
   ```bash
   make shell
   ```
5. **Run migrations**:
   ```bash
   alembic upgrade head
   ```
6. **Run the backend**:
   ```bash
   make run
   ```