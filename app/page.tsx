import Link from 'next/link';
 
export default function Home() {
  return (
<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
<div className="max-w-md w-full">
 
        <h1 className="text-3xl font-semibold text-gray-800 mb-1 text-center">
          Care Console
</h1>
<p className="text-gray-400 text-sm text-center mb-10">
          Apollo Health Axis · TeleHealth Platform
</p>
 
        <div className="space-y-4">
<Link href="/register" className="flex items-center gap-4 bg-white rounded-xl shadow p-5 hover:shadow-md transition">
<div className="text-2xl">📋</div>
<div>
<p className="font-medium text-gray-800">Register Patient</p>
<p className="text-sm text-gray-400">Create a new telehealth case</p>
</div>
</Link>
 
          <Link href="/paramedic" className="flex items-center gap-4 bg-white rounded-xl shadow p-5 hover:shadow-md transition">
<div className="text-2xl">🚑</div>
<div>
<p className="font-medium text-gray-800">Paramedic Dashboard</p>
<p className="text-sm text-gray-400">View open cases and submit notes</p>
</div>
</Link>
 
          <Link href="/doctor" className="flex items-center gap-4 bg-white rounded-xl shadow p-5 hover:shadow-md transition">
<div className="text-2xl">👨‍⚕️</div>
<div>
<p className="font-medium text-gray-800">Doctor Dashboard</p>
<p className="text-sm text-gray-400">Review notes and close cases</p>
</div>
</Link>
</div>
 
      </div>
</div>
  );
}