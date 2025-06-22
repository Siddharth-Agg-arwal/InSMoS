CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255)
);

CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    doctor_id INTEGER REFERENCES doctors(id),
    status VARCHAR(50) DEFAULT 'Good'
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration REAL,
    notes TEXT
);

CREATE TABLE eeg_data (
    time TIMESTAMPTZ NOT NULL,
    session_id BIGINT NOT NULL,
    channel_id SMALLINT NOT NULL,
    voltage_mv REAL
);

CREATE TABLE seizure_events (
    id SERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL,
    patient_id INTEGER REFERENCES patients(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration REAL,
    confidence_score REAL
);

SELECT create_hypertable('eeg_data', 'time');
