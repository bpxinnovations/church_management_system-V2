'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Users & roles management is disabled; redirect to dashboard. */
export default function UsersRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-gray-500">Redirecting...</p>
    </div>
  );
}
