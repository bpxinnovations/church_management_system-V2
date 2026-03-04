'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  HiOutlineHome,
  HiMenu,
  HiOutlineBell,
  HiX,
  HiOutlineSearch,
  HiOutlineLogout,
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
  HiOutlineTrendingUp,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentReport,
  HiOutlineClipboardList,
} from 'react-icons/hi';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { SYSTEM_ROLE_IDS } from '@/lib/rbac-types';
import { CircuitScopeProvider } from '@/lib/circuit-scope-context';

const circuitNav = [
  { name: 'Dashboard', href: '/circuit', icon: HiOutlineHome },
  { name: 'Societies', href: '/circuit/societies', icon: HiOutlineOfficeBuilding },
  { name: 'Ministers', href: '/circuit/ministers', icon: HiOutlineUserGroup },
  { name: 'Membership Growth', href: '/circuit/membership', icon: HiOutlineTrendingUp },
  { name: 'Society Levies', href: '/circuit/levies', icon: HiOutlineCurrencyDollar },
  { name: 'Circuit Finance', href: '/circuit/finance', icon: HiOutlineDocumentReport },
  { name: 'Society Reports', href: '/circuit/reports', icon: HiOutlineClipboardList },
];

export default function CircuitLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }
    if (user && user.roleId !== SYSTEM_ROLE_IDS.CIRCUIT_ADMIN && user.roleId !== SYSTEM_ROLE_IDS.HEAD_PASTOR) {
      router.push(user.roleId === SYSTEM_ROLE_IDS.DIOCESE_ADMIN ? '/diocese' : '/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user.roleId !== SYSTEM_ROLE_IDS.CIRCUIT_ADMIN && user.roleId !== SYSTEM_ROLE_IDS.HEAD_PASTOR) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside
        className={cn(
          'bg-white border-r border-gray-200 flex flex-col transition-all duration-300 hidden lg:flex',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <img src="/images/logos/logo.png" alt="Church Logo" className="w-8 h-8 object-contain" />
              <span className="font-semibold text-gray-800">Circuit</span>
            </div>
          )}
          {!sidebarOpen && (
            <div className="w-8 h-8 flex justify-center mx-auto">
              <img src="/images/logos/logo.png" alt="Church Logo" className="w-8 h-8 object-contain" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            <HiMenu className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {circuitNav.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/circuit' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium',
                  isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-green-600' : 'text-gray-500')} />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-14 md:h-16 flex items-center justify-between px-3 md:px-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <HiX className="h-5 w-5" /> : <HiMenu className="h-5 w-5" />}
          </button>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 max-w-md flex-1">
            <HiOutlineSearch className="h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm flex-1" />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
              <HiOutlineBell className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="hidden md:block text-right">
                <span className="block text-sm font-medium text-gray-900">{user.name}</span>
                <span className="block text-xs text-gray-500">{user.roleName}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-sm">
                {user.initials}
              </div>
              <button onClick={logout} className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg" title="Sign out">
                <HiOutlineLogout className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
            <div className="bg-white w-64 h-full shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <span className="font-semibold">Circuit Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                  <HiX className="h-5 w-5" />
                </button>
              </div>
              <nav className="p-3 space-y-1">
                {circuitNav.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                        isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <CircuitScopeProvider>{children}</CircuitScopeProvider>
        </main>
      </div>
    </div>
  );
}
