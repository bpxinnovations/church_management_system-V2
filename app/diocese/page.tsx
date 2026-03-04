'use client';

import { useMemo } from 'react';
import {
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
  HiOutlineTrendingUp,
  HiOutlineUsers,
  HiChevronRight,
  HiOutlineArrowRight,
  HiOutlineChartBar,
  HiOutlineDocumentReport,
} from 'react-icons/hi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getCircuits, getSocieties, getSocietiesByCircuitId, getSuperintendents } from '@/lib/diocese-circuit-storage';

const patternStyles = [
  { background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2316a34a\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' },
  { background: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%233b82f6\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41z\'/%3E%3C/g%3E%3C/svg%3E")' },
  { background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 50 Q25 30, 50 50 T100 50\' stroke=\'%2316a34a\' stroke-width=\'1.5\' fill=\'none\' opacity=\'0.12\'/%3E%3C/svg%3E")' },
  { background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%238b5cf6\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' },
];

export default function DioceseDashboard() {
  const { user } = useAuth();
  const circuits = getCircuits();
  const societies = getSocieties();
  const superintendents = getSuperintendents();

  const stats = useMemo(() => {
    const totalSocieties = societies.length;
    const totalMembers = societies.reduce((s, n) => s + n.memberCount, 0);
    const avgPerCircuit = circuits.length ? Math.round(totalMembers / circuits.length) : 0;
    const withSuperintendent = circuits.filter((c) => c.superintendentId).length;
    return { totalCircuits: circuits.length, totalSocieties, totalMembers, avgPerCircuit, withSuperintendent };
  }, [circuits, societies]);

  const chartData = useMemo(() => {
    const data = circuits.map((c) => {
      const socs = getSocietiesByCircuitId(c.id);
      const members = socs.reduce((s, n) => s + n.memberCount, 0);
      return { name: c.name, code: c.code, societies: socs.length, members };
    });
    const maxMembers = Math.max(1, ...data.map((d) => d.members));
    return data.map((d) => ({ ...d, barPercent: maxMembers ? (d.members / maxMembers) * 100 : 0 }));
  }, [circuits]);

  const statCards = [
    {
      title: 'Total Circuits',
      value: stats.totalCircuits.toString(),
      subtitle: `${stats.withSuperintendent} with superintendent`,
      icon: HiOutlineOfficeBuilding,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/diocese/circuits',
    },
    {
      title: 'Total Societies',
      value: stats.totalSocieties.toString(),
      subtitle: 'Across all circuits',
      icon: HiOutlineUserGroup,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/diocese/statistics',
    },
    {
      title: 'Total Members',
      value: stats.totalMembers.toLocaleString(),
      subtitle: 'Society membership',
      icon: HiOutlineUsers,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/diocese/statistics',
    },
    {
      title: 'Avg per Circuit',
      value: stats.avgPerCircuit.toString(),
      subtitle: 'Members per circuit',
      icon: HiOutlineTrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      href: '/diocese/performance',
    },
  ];

  const quickLinks = [
    { label: 'Manage Circuits', href: '/diocese/circuits' },
    { label: 'Superintendent Ministers', href: '/diocese/superintendents' },
    { label: 'Circuit Statistics', href: '/diocese/statistics' },
    { label: 'Financial Reports', href: '/diocese/financial-reports' },
    { label: 'Circuit Performance', href: '/diocese/performance' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Welcome back, {user?.name || 'Diocese Admin'}!
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Overview of circuits, societies and key metrics across the diocese
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const pattern = patternStyles[index % patternStyles.length];
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="absolute inset-0" style={{ backgroundImage: pattern.background }} />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-xl font-semibold text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.subtitle}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'g\' width=\'40\' height=\'40\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 40 0 L 0 0 0 40\' fill=\'none\' stroke=\'%2316a34a\' stroke-width=\'1\' opacity=\'0.15\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100\' height=\'100\' fill=\'url(%23g)\'/%3E%3C/svg%3E")',
            }}
          />
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <HiOutlineChartBar className="h-5 w-5 text-green-600" />
                Membership by Circuit
              </CardTitle>
              <Link href="/diocese/statistics" className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                View details
                <HiChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              {chartData.length === 0 ? (
                <p className="text-sm text-gray-500 py-6 text-center">No circuit data yet. Add circuits to see the chart.</p>
              ) : (
                <div className="overflow-y-auto max-h-[320px] pr-1 -mr-1 space-y-3" style={{ minHeight: '120px' }}>
                  <div className="flex items-center gap-2 text-xs text-gray-500 border-b border-gray-100 pb-2 mb-1 sticky top-0 bg-white z-10">
                    <span className="w-[min(180px,40%)] shrink-0 font-medium text-gray-700">Circuit</span>
                    <span className="flex-1 min-w-0">Members</span>
                    <span className="w-14 text-right shrink-0 font-medium text-gray-700">Count</span>
                  </div>
                  {chartData.map((d) => (
                    <div key={d.name} className="flex items-center gap-2 gap-y-1 flex-wrap">
                      <span className="w-[min(180px,40%)] shrink-0 text-sm text-gray-900 truncate font-medium" title={d.name}>
                        {d.code ? `${d.code} — ` : ''}{d.name}
                      </span>
                      <div className="flex-1 min-w-[80px] h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all min-w-[4px]"
                          style={{ width: `${Math.max(2, d.barPercent)}%` }}
                          title={`${d.members} members`}
                        />
                      </div>
                      <span className="w-14 text-right shrink-0 text-sm font-semibold text-gray-900 tabular-nums">
                        {d.members.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/diocese/circuits" className="inline-block mt-2">
                <Button variant="outline" size="sm">
                  Manage Circuits
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-600 text-white border-0 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16 opacity-10" />
          <CardContent className="p-6 relative z-10">
            <div className="mb-4">
              <CardTitle className="text-base font-semibold text-white mb-2">Quick Actions</CardTitle>
              <p className="text-xs text-green-50">Quick access to diocese administration</p>
            </div>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button variant="outline" className="w-full bg-white text-green-600 hover:bg-green-50 border-0 mb-2">
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-30"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 50 Q25 30, 50 50 T100 50\' stroke=\'%2316a34a\' stroke-width=\'1.5\' fill=\'none\' opacity=\'0.12\'/%3E%3C/svg%3E")',
          }}
        />
        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-900">Circuit summary</CardTitle>
            <Link href="/diocese/circuits" className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
              See all
              <HiOutlineArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-3">
            {circuits.slice(0, 5).map((c) => {
              const socs = getSocietiesByCircuitId(c.id);
              const members = socs.reduce((s, n) => s + n.memberCount, 0);
              const sup = superintendents.find((m) => m.id === c.superintendentId);
              return (
                <Link key={c.id} href="/diocese/circuits">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-3 transition-colors cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {socs.length} societies · {members} members
                        {sup ? ` · ${sup.name}` : ''}
                      </p>
                    </div>
                    <HiChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                  </div>
                </Link>
              );
            })}
          </div>
          {circuits.length === 0 && (
            <p className="text-sm text-gray-500 py-4 text-center">No circuits yet. Add circuits to get started.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
