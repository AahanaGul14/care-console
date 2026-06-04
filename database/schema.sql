CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INT,
  symptoms TEXT,
  vitals JSONB,
  emergency_flag BOOLEAN DEFAULT false,
  assigned_paramedic TEXT,
  status TEXT DEFAULT 'REGISTERED',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE telehealth_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  paramedic_notes TEXT,
  doctor_diagnosis TEXT,
  medication TEXT,
  status TEXT DEFAULT 'OPEN',
  temporal_workflow_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);