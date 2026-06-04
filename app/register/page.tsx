'use client';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { CREATE_PATIENT, CREATE_CASE } from '@/lib/queries';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    age: '',
    symptoms: '',
    emergency_flag: false,
    assigned_paramedic: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [createPatient, { loading: creatingPatient }] = useMutation(CREATE_PATIENT);
  const [createCase, { loading: creatingCase }]       = useMutation(CREATE_CASE);

  const loading = creatingPatient || creatingCase;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement;
    setForm(prev => ({
      ...prev,
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Patient name is required.');
      return;
    }

    try {
      // Step 1 — create the patient
      const { data: patientData } = await createPatient({
        variables: {
          name: form.name,
          age: form.age ? parseInt(form.age) : null,
          symptoms: form.symptoms,
          emergency_flag: form.emergency_flag,
          assigned_paramedic: form.assigned_paramedic,
        },
      });

      const patientId = patientData.insert_patients_one.id;

      // Step 2 — create the telehealth case linked to that patient
      await createCase({ variables: { patient_id: patientId } });

      setSubmitted(true);
    } catch (err: any) {
      setError('Something went wrong. Check your Hasura connection.');
      console.error(err);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow text-center max-w-md w-full">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Patient Registered</h2>
          <p className="text-gray-500 mb-6">Telehealth case created and workflow started.</p>
          <button
            onClick={() => { setForm({ name:'', age:'', symptoms:'', emergency_flag:false, assigned_paramedic:'' }); setSubmitted(false); }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register Another Patient
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-lg">

        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Register Patient</h1>
        <p className="text-gray-400 text-sm mb-6">Fill in the details to open a telehealth case</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
            <input
              name="name" value={form.name} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Ravi Kumar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              name="age" value={form.age} onChange={handleChange} type="number"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 35"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
            <textarea
              name="symptoms" value={form.symptoms} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the patient's symptoms..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Paramedic</label>
            <input
              name="assigned_paramedic" value={form.assigned_paramedic} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Priya Sharma"
            />
          </div>

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox" name="emergency_flag" id="emergency"
              checked={form.emergency_flag} onChange={handleChange}
              className="w-4 h-4 accent-red-500"
            />
            <label htmlFor="emergency" className="text-sm font-medium text-red-600">
              🚨 Mark as Emergency
            </label>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register Patient & Open Case'}
          </button>

        </form>
      </div>
    </div>
  );
}