'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CASES, GET_CASE_DETAIL, DOCTOR_CLOSE, DOCTOR_FOLLOWUP } from '@/lib/queries';
 
type Case = {
  id: string;
  status: string;
  paramedic_notes: string | null;
  doctor_diagnosis: string | null;
  medication: string | null;
  patient: {
    id: string;
    name: string;
    age: number;
    symptoms: string;
    emergency_flag: boolean;
    assigned_paramedic: string;
  };
};
 
// ─── Status badge component ──────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    OPEN:             'bg-blue-100 text-blue-600',
    READY_FOR_DOCTOR: 'bg-amber-100 text-amber-600',
    CLOSED:           'bg-green-100 text-green-600',
    FOLLOWUP_REQUIRED:'bg-purple-100 text-purple-600',
  };
  return (
<span className={`text-xs font-medium px-3 py-1 rounded-full ${styles[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {status.replace(/_/g, ' ')}
</span>
  );
}
 
// ─── Case detail view ────────────────────────────────────
function CaseDetail({ caseItem, onBack, onDone }: {
  caseItem: Case;
  onBack: () => void;
  onDone: () => void;
}) {
  const [diagnosis, setDiagnosis]   = useState('');
  const [medication, setMedication] = useState('');
  const [actionDone, setActionDone] = useState('');
  const [formError, setFormError]   = useState('');
 
  const [closeCase,    { loading: closing }]   = useMutation(DOCTOR_CLOSE);
  const [followupCase, { loading: followingUp }] = useMutation(DOCTOR_FOLLOWUP);
 
  const loading = closing || followingUp;
 
  async function handleAction(action: 'close' | 'followup') {
    setFormError('');
    if (!diagnosis.trim()) {
      setFormError('Please enter a diagnosis before proceeding.');
      return;
    }
 
    const mutation = action === 'close' ? closeCase : followupCase;
    await mutation({
      variables: { id: caseItem.id, diagnosis, medication },
    });
 
    setActionDone(action === 'close' ? 'CLOSED' : 'FOLLOWUP_REQUIRED');
  }
 
  // Success screen
  if (actionDone) {
    return (
<div className="min-h-screen flex items-center justify-center bg-gray-50">
<div className="bg-white p-8 rounded-xl shadow text-center max-w-md w-full">
<div className="text-4xl mb-4">
            {actionDone === 'CLOSED' ? '✅' : '🔄'}
</div>
<h2 className="text-xl font-semibold text-gray-800 mb-2">
            {actionDone === 'CLOSED' ? 'Case Closed' : 'Follow-up Scheduled'}
</h2>
<p className="text-gray-500 mb-2">
            {actionDone === 'CLOSED'
              ? 'The telehealth case has been successfully closed.'
              : 'Case marked for follow-up consultation.'}
</p>
<StatusBadge status={actionDone} />
<div className="mt-6">
<button
              onClick={onDone}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
>
              Back to Dashboard
</button>
</div>
</div>
</div>
    );
  }
 
  return (
<div className="min-h-screen bg-gray-50 p-6">
<div className="max-w-2xl mx-auto">
 
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1"
>
          ← Back to cases
</button>
 
        {/* Patient info card */}
<div className="bg-white rounded-xl shadow p-6 mb-4">
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-2">
<h2 className="text-lg font-semibold text-gray-800">
                {caseItem.patient.name}
</h2>
              {caseItem.patient.emergency_flag && (
<span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                  🚨 Emergency
</span>
              )}
</div>
<StatusBadge status={caseItem.status} />
</div>
<p className="text-sm text-black mb-4">
            Age: {caseItem.patient.age} · Paramedic: {caseItem.patient.assigned_paramedic}
</p>
 
          <div className="bg-gray-50 rounded-lg p-4 mb-3">
<p className="text-xs text-red-700 font-semibold uppercase tracking-wide mb-1">Symptoms</p>
<p className="text-sm text-gray-700">
              {caseItem.patient.symptoms || 'None recorded'}
</p>
</div>
 
          <div className="bg-blue-50 rounded-lg p-4">
<p className="text-xs text-blue-700 font-semibold uppercase tracking-wide mb-1">
              Paramedic Notes
</p>
<p className="text-sm text-gray-700">
              {caseItem.paramedic_notes || 'No notes submitted yet'}
</p>
</div>
</div>
 
        {/* Doctor input card */}
<div className="bg-white rounded-xl shadow p-6">
<h3 className="text-base font-semibold text-gray-800 mb-4">
            Doctor's Assessment
</h3>
 
          {formError && (
<div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
              {formError}
</div>
          )}
 
          <div className="space-y-4">
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnosis *
</label>
<textarea
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your diagnosis..."
                rows={3}
              />
</div>
 
            <div>
<label className="block text-sm font-medium text-gray-700 mb-1">
                Medication / Prescription
</label>
<textarea
                value={medication}
                onChange={e => setMedication(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Prescribe medication or treatment plan..."
                rows={2}
              />
</div>
 
            {/* Two action buttons */}
<div className="flex gap-3 pt-2">
<button
                onClick={() => handleAction('close')}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
>
                {closing ? 'Closing...' : '✅ Close Case'}
</button>
<button
                onClick={() => handleAction('followup')}
                disabled={loading}
                className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
>
                {followingUp ? 'Scheduling...' : '🔄 Needs Follow-up'}
</button>
</div>
</div>
</div>
 
      </div>
</div>
  );
}
 
// ─── Main page ───────────────────────────────────────────
export default function DoctorPage() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
 
  const { data, loading, error, refetch } = useQuery(GET_CASES, {
    variables: { status: 'READY_FOR_DOCTOR' },
    fetchPolicy: 'network-only',
  });
 
  if (selectedCase) {
    return (
<CaseDetail
        caseItem={selectedCase}
        onBack={() => setSelectedCase(null)}
        onDone={() => { setSelectedCase(null); refetch(); }}
      />
    );
  }
 
  return (
<div className="min-h-screen bg-gray-50 p-6">
<div className="max-w-2xl mx-auto">
 
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          Doctor Dashboard
</h1>
<p className="text-gray-400 text-sm mb-6">
          Cases ready for your consultation
</p>
 
        {loading && (
<p className="text-gray-400 text-sm">Loading cases...</p>
        )}
        {error && (
<p className="text-red-500 text-sm">
            Error loading cases. Check Hasura connection.
</p>
        )}
 
        {!loading && data?.telehealth_cases.length === 0 && (
<div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
            No cases ready for consultation yet. Waiting for paramedic notes.
</div>
        )}
 
        <div className="space-y-3">
          {data?.telehealth_cases.map((c: Case) => (
<div
              key={c.id}
              onClick={() => setSelectedCase(c)}
              className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-md transition"
>
<div className="flex items-center justify-between mb-2">
<div className="flex items-center gap-2">
<span className="font-medium text-gray-800">
                    {c.patient.name}
</span>
                  {c.patient.emergency_flag && (
<span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                      🚨 Emergency
</span>
                  )}
</div>
<StatusBadge status={c.status} />
</div>
<p className="text-sm text-blue-700">
                Age {c.patient.age} · {c.patient.symptoms?.slice(0, 60)} 
</p>
<div className="mt-2 text-xs text-black">
                Paramedic: {c.patient.assigned_paramedic} · Tap to review →
</div>
</div>
          ))}
</div>
 
      </div>
</div>
  );
}