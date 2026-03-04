'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, dashboardPath } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(dashboardPath);
    } else {
      router.push('/signin');
    }
  }, [isAuthenticated, dashboardPath, router]);

  return null;
}
