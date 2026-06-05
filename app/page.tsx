'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_CASES } from '@/lib/queries';

function CaseCount({ status, label, color }: {
  status: string;
  label: string;
  color: string;
}) {
  const { data } = useQuery(GET_CASES, {
    variables: { status },
    fetchPolicy: 'network-only',
  });
  const count = data?.telehealth_cases?.length ?? '—';

  return (
    <div className={`rounded-xl p-4 text-center ${color}`}>
      <p className="text-2xl font-semibold">{count}</p>
      <p className="text-xs mt-1">{label}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">

        {/* Logo and title */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/images/Apollo_Hospitals_Logo.png"
            alt="Apollo Health Axis"
            width={120}
            height={120}
            className="mb-4"
            priority
          />
          <h1 className="text-3xl font-semibold text-gray-800 mb-1 text-center">
            Care Console
          </h1>
          <p className="text-gray-400 text-sm text-center">
            Apollo Health Axis · TeleHealth Platform
          </p>
        </div>

        {/* Live case counts */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <CaseCount
            status="OPEN"
            label="Open cases"
            color="bg-blue-50 text-blue-600"
          />
          <CaseCount
            status="READY_FOR_DOCTOR"
            label="Awaiting doctor"
            color="bg-amber-50 text-amber-600"
          />
          <CaseCount
            status="CLOSED"
            label="Closed"
            color="bg-green-50 text-green-600"
          />
        </div>

        {/* Role cards */}
        <div className="space-y-3">
          <Link href="/register" className="flex items-center gap-4 bg-white rounded-xl shadow p-5 hover:shadow-md transition">
            <div className="text-2xl">📋</div>
            <div>
              <p className="font-medium text-gray-800">Register Patient</p>
              <p className="text-sm text-gray-400">Create a new telehealth case</p>
            </div>
            <span className="ml-auto text-gray-300">→</span>
          </Link>

          <Link href="/paramedic" className="flex items-center gap-4 bg-white rounded-xl shadow p-5 hover:shadow-md transition">
            <div className="text-2xl">🚑</div>
            <div>
              <p className="font-medium text-gray-800">Paramedic Dashboard</p>
              <p className="text-sm text-gray-400">View open cases and submit notes</p>
            </div>
            <span className="ml-auto text-gray-300">→</span>
          </Link>

          <Link href="/doctor" className="flex items-center gap-4 bg-white rounded-xl shadow p-5 hover:shadow-md transition">
            <div className="text-2xl">👨‍⚕️</div>
            <div>
              <p className="font-medium text-gray-800">Doctor Dashboard</p>
              <p className="text-sm text-gray-400">Review notes and close cases</p>
            </div>
            <span className="ml-auto text-gray-300">→</span>
          </Link>
        </div>

      </div>
    </div>
  );
}