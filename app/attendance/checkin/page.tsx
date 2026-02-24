'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { addCheckIn } from '@/lib/attendance-storage';
import { HiCheckCircle } from 'react-icons/hi';

function CheckInForm() {
  const searchParams = useSearchParams();
  const service = searchParams.get('service') || 'Service';
  const date = searchParams.get('date') || new Date().toISOString().slice(0, 10);
  const [submitted, setSubmitted] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [churchNumber, setChurchNumber] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const name = memberName.trim();
    if (!name) {
      setError('Please enter your name.');
      return;
    }
    setLoading(true);
    const checkInTime = new Date().toISOString();
    addCheckIn({
      memberName: name,
      churchNumber: churchNumber.trim() || undefined,
      gender,
      service,
      date,
      checkInTime,
      method: 'qr',
    });
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <HiCheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Check-in recorded</h1>
          <p className="text-gray-600">
            Your attendance was recorded at {new Date().toLocaleTimeString()}.
          </p>
          <p className="text-sm text-gray-500 mt-4">You may close this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">Attendance check-in</h1>
          <p className="text-sm text-gray-600 mt-1">
            {service} · {new Date(date).toLocaleDateString()}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your name *</label>
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Full name"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Church number (optional)
            </label>
            <input
              type="text"
              value={churchNumber}
              onChange={(e) => setChurchNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g. CH-0001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit check-in'}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Time will be recorded when you submit.
        </p>
      </div>
    </div>
  );
}

export default function AttendanceCheckInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-600">Loading...</p>
        </div>
      }
    >
      <CheckInForm />
    </Suspense>
  );
}
