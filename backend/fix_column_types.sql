-- Migration to fix column types for foreign keys
-- Convert doctor_id from varchar to uuid
ALTER TABLE patients 
ALTER COLUMN doctor_id TYPE uuid USING doctor_id::uuid;

-- Convert service_id from varchar to uuid  
ALTER TABLE patients 
ALTER COLUMN service_id TYPE uuid USING service_id::uuid;

-- Add foreign key constraints
ALTER TABLE patients 
ADD CONSTRAINT patients_doctor_id_doctors_id_fk 
FOREIGN KEY (doctor_id) REFERENCES doctors(id);

ALTER TABLE patients 
ADD CONSTRAINT patients_service_id_services_id_fk 
FOREIGN KEY (service_id) REFERENCES services(id);
