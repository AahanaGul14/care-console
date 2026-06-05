import { gql } from '@apollo/client';

export const CREATE_PATIENT = gql`
  mutation CreatePatient(
    $name: String!,
    $age: Int,
    $symptoms: String,
    $emergency_flag: Boolean,
    $assigned_paramedic: String
  ) {
    insert_patients_one(object: {
      name: $name,
      age: $age,
      symptoms: $symptoms,
      emergency_flag: $emergency_flag,
      assigned_paramedic: $assigned_paramedic
    }) { id status }
  }
`;

export const CREATE_CASE = gql`
  mutation CreateCase($patient_id: uuid!) {
    insert_telehealth_cases_one(object: { patient_id: $patient_id }) { id }
  }
`;

export const PARAMEDIC_UPDATE = gql`
  mutation ParamedicUpdate($id: uuid!, $notes: String!) {
    update_telehealth_cases_by_pk(
      pk_columns: { id: $id },
      _set: { paramedic_notes: $notes, status: "READY_FOR_DOCTOR" }
    ) { id status }
  }
`;

export const DOCTOR_CLOSE = gql`
  mutation DoctorClose($id: uuid!, $diagnosis: String!, $medication: String!) {
    update_telehealth_cases_by_pk(
      pk_columns: { id: $id },
      _set: { doctor_diagnosis: $diagnosis, medication: $medication, status: "CLOSED" }
    ) { id status }
  }
`;

export const GET_CASES = gql`
  query GetCases($status: String!) {
    telehealth_cases(where: { status: { _eq: $status } }) {
      id
      status
      paramedic_notes
      patient {
        id name age symptoms emergency_flag assigned_paramedic
      }
    }
  }
`;