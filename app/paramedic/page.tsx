'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CASES, PARAMEDIC_UPDATE } from '@/lib/queries';

type Case = {
  id: string;
  status: string;
  paramedic_notes: string | null;
  patient: {
    id: string;
    name: string;
    age: number;
    symptoms: string;
    emergency_flag: boolean;
    assigned_paramedic: string;
  };
};

export default function ParamedicPage() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [notes, setNotes] = useState('');
  const [done, setDone] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_CASES, {
    variables: { status: 'OPEN' },
    fetchPolicy: 'network-only',
  });

  const [updateCase, { loading: updating }] = useMutation(PARAMEDIC_UPDATE);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCase || !notes.trim()) return;
    await updateCase({ variables: { id: selectedCase.id, notes } });
    setDone(true);
    refetch();
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow text-center max-w-md w-full">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Notes Submitted</h2>
          <p className="text-gray-500 mb-6">Case is now ready for doctor consultation.</p>
          <button
            onClick={() => { setDone(false); setSelectedCase(null); setNotes(''); }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Cases
          </button>
        </div>
      </div>
    );
  }

  // Case detail view
  if (selectedCase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow p-8 w-full max-w-lg">

          <button onClick={() => setSelectedCase(null)} className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">
            ← Back to cases
          </button>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold text-gray-800">{selectedCase.patient.name}</h1>
              {selectedCase.patient.emergency_flag && (
                <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">🚨 Emergency</span>
              )}
            </div>
            <p className="text-sm text-gray-400">Age: {selectedCase.patient.age} · Assigned to: {selectedCase.patient.assigned_paramedic}</p>
            <div className="mt-3 bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Symptoms</p>
              <p className="text-sm text-gray-700">{selectedCase.patient.symptoms || 'None recorded'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paramedic Notes *</label>
              <textarea
                value={notes} onChange={e => setNotes(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Record vitals, observations, and initial assessment..."
                rows={5}
              />
            </div>

            <button
              type="submit" disabled={updating || !notes.trim()}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? 'Submitting...' : 'Submit Notes → Ready for Doctor'}
            </button>
          </form>

        </div>
      </div>
    );
  }

  // Case list view
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Paramedic Dashboard</h1>
        <p className="text-gray-400 text-sm mb-6">Open cases waiting for your notes</p>

        {loading && <p className="text-gray-400 text-sm">Loading cases...</p>}
        {error && <p className="text-red-500 text-sm">Error loading cases. Check Hasura connection.</p>}

        {!loading && data?.telehealth_cases.length === 0 && (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
            No open cases right now. Register a patient first.
          </div>
        )}

        <div className="space-y-3">
          {data?.telehealth_cases.map((c: Case) => (
            <div
              key={c.id}
              onClick={() => { setSelectedCase(c); setNotes(''); }}
              className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{c.patient.name}</span>
                  {c.patient.emergency_flag && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">🚨 Emergency</span>
                  )}
                </div>
                <span className="bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">OPEN</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Age {c.patient.age} · {c.patient.symptoms?.slice(0, 60)}...</p>
              <p className="text-xs text-gray-300 mt-2">Tap to open →</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}