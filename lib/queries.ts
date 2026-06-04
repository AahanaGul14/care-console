import { gql } from '@apollo/client';

export const CREATE_PATIENT = gql`
mutation CreatePatient(
  $name: String!,
  $age: Int,
  $symptoms: String,
  $emergency_flag: Boolean,
  $assigned_paramedic: String
) {
  insert_patients_one(
    object: {
      name: $name
      age: $age
      symptoms: $symptoms
      emergency_flag: $emergency_flag
      assigned_paramedic: $assigned_paramedic
    }
  ) {
    id
  }
}
`;

export const CREATE_CASE = gql`
mutation CreateCase($patient_id: uuid!) {
  insert_telehealth_cases_one(
    object: {
      patient_id: $patient_id
    }
  ) {
    id
  }
}
`;
