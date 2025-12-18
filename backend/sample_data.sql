-- Sample data insertion script for InSMoS database
-- This script inserts 1 doctor, 10 patients, notable sessions, and appointments

-- Insert Doctor
INSERT INTO doctors (id, name, specialty) VALUES
(1, 'Dr. Sarah Mitchell', 'Neurologist - Epilepsy Specialist');

-- Insert Patients with complete medical information
INSERT INTO patients (id, name, age, doctor_id, status, condition, blood_type, seizure_frequency, medication, guardian, contact) VALUES
(1, 'Emma Rodriguez', 8, 1, 'Stable', 'Focal Epilepsy', 'A+', '1-2 per month', 'Levetiracetam 500mg', 'Maria Rodriguez', '+1-555-0101'),
(2, 'Liam Chen', 12, 1, 'Improving', 'Generalized Epilepsy', 'O+', '3-4 per month', 'Valproate 600mg', 'Wei Chen', '+1-555-0102'),
(3, 'Sophia Patel', 6, 1, 'Under Observation', 'Absence Seizures', 'B+', '5-8 per month', 'Ethosuximide 250mg', 'Raj Patel', '+1-555-0103'),
(4, 'Noah Johnson', 15, 1, 'Stable', 'Temporal Lobe Epilepsy', 'AB+', '2-3 per month', 'Carbamazepine 400mg', 'Jennifer Johnson', '+1-555-0104'),
(5, 'Olivia Williams', 10, 1, 'Critical', 'Refractory Epilepsy', 'A-', '10-15 per month', 'Lamotrigine 200mg + Topiramate 100mg', 'David Williams', '+1-555-0105'),
(6, 'Ethan Brown', 14, 1, 'Stable', 'Juvenile Myoclonic Epilepsy', 'O-', '1-2 per month', 'Levetiracetam 750mg', 'Amanda Brown', '+1-555-0106'),
(7, 'Ava Martinez', 7, 1, 'Improving', 'Benign Rolandic Epilepsy', 'B-', '2-4 per month', 'Oxcarbazepine 300mg', 'Carlos Martinez', '+1-555-0107'),
(8, 'Mason Davis', 11, 1, 'Under Observation', 'Frontal Lobe Epilepsy', 'AB-', '4-6 per month', 'Zonisamide 200mg', 'Lisa Davis', '+1-555-0108'),
(9, 'Isabella Garcia', 9, 1, 'Stable', 'Photosensitive Epilepsy', 'A+', '1-3 per month', 'Valproate 500mg', 'Miguel Garcia', '+1-555-0109'),
(10, 'Lucas Anderson', 13, 1, 'Improving', 'Nocturnal Epilepsy', 'O+', '2-3 per month', 'Clobazam 10mg', 'Robert Anderson', '+1-555-0110');

-- Insert Notable Sessions (seizure events)
-- Emma Rodriguez sessions
INSERT INTO notable_sessions (patient_id, start_time, end_time, duration, notes) VALUES
(1, '2025-12-01 14:30:00', '2025-12-01 14:35:00', 5.0, 'Brief focal seizure during afternoon activity. Patient remained conscious. No intervention required.'),
(1, '2025-12-15 10:15:00', '2025-12-15 10:22:00', 7.0, 'Focal aware seizure with motor symptoms. Parent present, patient recovered quickly.');

-- Liam Chen sessions
INSERT INTO notable_sessions (patient_id, start_time, end_time, duration, notes) VALUES
(2, '2025-11-28 08:45:00', '2025-11-28 08:52:00', 7.0, 'Generalized tonic-clonic seizure. Emergency medication administered. Full recovery within 20 minutes.'),
(2, '2025-12-05 16:20:00', '2025-12-05 16:28:00', 8.0, 'Absence seizure followed by confusion. Monitored closely.'),
(2, '2025-12-12 11:30:00', '2025-12-12 11:37:00', 7.0, 'Brief generalized seizure. Responded well to rescue medication.');

-- Sophia Patel sessions
INSERT INTO notable_sessions (patient_id, start_time, end_time, duration, notes) VALUES
(3, '2025-12-03 09:15:00', '2025-12-03 09:17:00', 2.0, 'Typical absence seizure lasting approximately 10 seconds. Activity resumed normally.'),
(3, '2025-12-07 13:45:00', '2025-12-07 13:48:00', 3.0, 'Multiple absence seizures during class. Teacher reported 5+ episodes.'),
(3, '2025-12-14 10:30:00', '2025-12-14 10:32:00', 2.0, 'Brief absence seizure, no complications.');

-- Noah Johnson sessions
INSERT INTO notable_sessions (patient_id, start_time, end_time, duration, notes) VALUES
(4, '2025-11-25 19:45:00', '2025-11-25 19:53:00', 8.0, 'Complex partial seizure with altered awareness. Déjà vu sensation reported before onset.'),
(4, '2025-12-10 15:20:00', '2025-12-10 15:26:00', 6.0, 'Temporal lobe seizure with automatisms. Patient confused post-ictally.');

-- Olivia Williams sessions (more frequent due to refractory epilepsy)
INSERT INTO notable_sessions (patient_id, start_time, end_time, duration, notes) VALUES
(5, '2025-12-02 07:30:00', '2025-12-02 07:40:00', 10.0, 'Prolonged seizure requiring emergency medication. Parent administered rescue medication.'),
(5, '2025-12-04 12:15:00', '2025-12-04 12:23:00', 8.0, 'Generalized seizure with fall. Minor bruising, no serious injury.'),
(5, '2025-12-08 18:45:00', '2025-12-08 18:52:00', 7.0, 'Evening seizure, responded to medication adjustment.'),
(5, '2025-12-11 14:00:00', '2025-12-11 14:12:00', 12.0, 'Status epilepticus concern. ER visit recommended. Seizure broke with additional medication.'),
(5, '2025-12-16 09:30:00', '2025-12-16 09:38:00', 8.0, 'Morning seizure cluster. 3 seizures within 2 hours.');

-- Ethan Brown sessions
INSERT INTO notable_sessions (patient_id, start_time, end_time, duration, notes) VALUES
(6, '2025-12-06 06:45:00', '2025-12-06 06:48:00', 3.0, 'Myoclonic jerks upon waking. Typical JME pattern.'),
(6, '2025-12-13 07:15:00', '2025-12-13 07:18:00', 3.0, 'Morning myoclonic seizure. Patient reports missed dose yesterday.');

-- Ava Martinez sessions
INSERT INTO notable_sessions (patient_id, start_time, end_time, duration, notes) VALUES
(7, '2025-12-01 22:30:00', '2025-12-01 22:34:00', 4.0, 'Nocturnal focal seizure. Parent observed facial twitching and drooling.'),
(7, '2025-12-09 23:15:00', '2025-12-09 23:20:00', 5.0, 'Nighttime seizure with speech arrest. Benign course expected.');

-- Mason Davis sessions
INSERT INTO notable_sessions (patient_id, start_time, end_time, duration, notes) VALUES
(8, '2025-11-30 16:30:00', '2025-11-30 16:38:00', 8.0, 'Frontal lobe seizure with motor manifestations. Bicycle movements observed.'),
(8, '2025-12-08 21:00:00', '2025-12-08 21:06:00', 6.0, 'Nocturnal seizure, complex motor behavior. Parent intervened safely.');

-- Isabella Garcia sessions
INSERT INTO notable_sessions (patient_id, start_time, end_time, duration, notes) VALUES
(9, '2025-12-03 11:30:00', '2025-12-03 11:35:00', 5.0, 'Photosensitive seizure triggered by video game. Screen time restrictions discussed.'),
(9, '2025-12-12 15:45:00', '2025-12-12 15:49:00', 4.0, 'Brief generalized seizure. Advised to continue avoiding bright flashing lights.');

-- Lucas Anderson sessions
INSERT INTO notable_sessions (patient_id, start_time, end_time, duration, notes) VALUES
(10, '2025-12-05 02:30:00', '2025-12-05 02:35:00', 5.0, 'Nocturnal seizure during REM sleep. Parent heard unusual sounds.'),
(10, '2025-12-14 03:15:00', '2025-12-14 03:21:00', 6.0, 'Night seizure with tonic-clonic movements. Sleep study recommended.');

-- Insert Appointments (mix of past, present, and future)
INSERT INTO appointments (patient_id, patient_name, is_new_patient, patient_age, appointment_date, appointment_time, doctor_id, doctor_name, reason, notes, status, created_at) VALUES
-- Completed appointments
(1, 'Emma Rodriguez', false, 8, '2025-12-02', '09:00:00', 1, 'Dr. Sarah Mitchell', 'Follow-up', 'Review recent seizure activity and medication effectiveness. Patient doing well overall.', 'Completed', '2025-11-25 10:30:00'),
(2, 'Liam Chen', false, 12, '2025-12-05', '10:30:00', 1, 'Dr. Sarah Mitchell', 'Routine checkup', 'Quarterly checkup. Discussed recent increase in seizure frequency. Adjusted medication dosage.', 'Completed', '2025-11-28 14:15:00'),
(5, 'Olivia Williams', false, 10, '2025-12-12', '08:30:00', 1, 'Dr. Sarah Mitchell', 'Consultation', 'Emergency consultation due to increased seizure frequency. Considering medication changes and VNS evaluation.', 'Completed', '2025-12-10 16:45:00'),
(3, 'Sophia Patel', false, 6, '2025-12-09', '14:00:00', 1, 'Dr. Sarah Mitchell', 'Lab Results', 'Review EEG results from last week. Absence seizures pattern confirmed. Treatment plan adjusted.', 'Completed', '2025-12-02 11:20:00'),

-- Upcoming appointments
(4, 'Noah Johnson', false, 15, '2025-12-20', '11:00:00', 1, 'Dr. Sarah Mitchell', 'Follow-up', 'Post-medication adjustment follow-up. Review seizure diary and discuss school accommodations.', 'Scheduled', '2025-12-13 09:45:00'),
(6, 'Ethan Brown', false, 14, '2025-12-23', '13:30:00', 1, 'Dr. Sarah Mitchell', 'Routine checkup', 'Six-month follow-up for JME management. Blood work ordered to check medication levels.', 'Scheduled', '2025-12-15 15:30:00'),
(7, 'Ava Martinez', false, 7, '2025-12-27', '10:00:00', 1, 'Dr. Sarah Mitchell', 'Follow-up', 'Review progress since medication change. Benign epilepsy monitoring.', 'Scheduled', '2025-12-17 13:00:00'),
(8, 'Mason Davis', false, 11, '2026-01-05', '09:30:00', 1, 'Dr. Sarah Mitchell', 'Consultation', 'Discuss surgical evaluation options for frontal lobe epilepsy. Review recent video EEG results.', 'Scheduled', '2025-12-14 10:00:00'),
(9, 'Isabella Garcia', false, 9, '2026-01-08', '14:30:00', 1, 'Dr. Sarah Mitchell', 'Routine checkup', 'Quarterly appointment. Photosensitivity management and lifestyle modifications review.', 'Scheduled', '2025-12-16 11:45:00'),
(10, 'Lucas Anderson', false, 13, '2026-01-12', '11:30:00', 1, 'Dr. Sarah Mitchell', 'Lab Results', 'Sleep study results discussion. Nocturnal seizure pattern analysis.', 'Scheduled', '2025-12-18 14:20:00'),
(5, 'Olivia Williams', false, 10, '2025-12-30', '08:00:00', 1, 'Dr. Sarah Mitchell', 'Follow-up', 'Urgent follow-up for medication adjustment. Monitoring refractory epilepsy progression.', 'Scheduled', '2025-12-18 16:00:00'),
(1, 'Emma Rodriguez', false, 8, '2026-01-15', '15:00:00', 1, 'Dr. Sarah Mitchell', 'Routine checkup', 'Quarterly checkup and medication refill. Seizure-free goal assessment.', 'Scheduled', '2025-12-17 09:30:00'),

-- One cancelled appointment
(2, 'Liam Chen', false, 12, '2025-12-18', '13:00:00', 1, 'Dr. Sarah Mitchell', 'Follow-up', 'Patient rescheduled due to school commitment.', 'Cancelled', '2025-12-10 10:15:00');

-- Reset sequences to continue from the last inserted ID
SELECT setval('doctors_id_seq', (SELECT MAX(id) FROM doctors));
SELECT setval('patients_id_seq', (SELECT MAX(id) FROM patients));
SELECT setval('notable_sessions_id_seq', (SELECT MAX(id) FROM notable_sessions));
SELECT setval('appointments_id_seq', (SELECT MAX(id) FROM appointments));
