'use client';

import { useMemo } from 'react';
import { HiOutlineUsers, HiOutlineTrendingUp } from 'react-icons/hi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCircuitScope } from '@/lib/circuit-scope-context';
import { getSocietiesByCircuitId } from '@/lib/diocese-circuit-storage';

export default function CircuitMembershipPage() {
  const { circuitId, circuit } = useCircuitScope();
  const societies = circuit ? getSocietiesByCircuitId(circuit.id) : [];

  const stats = useMemo(() => {
    const total = societies.reduce((s, n) => s + n.memberCount, 0);
    const avg = societies.length ? Math.round(total / societies.length) : 0;
    const largest = societies.length ? Math.max(...societies.map((s) => s.memberCount)) : 0;
    const smallest = societies.length ? Math.min(...societies.map((s) => s.memberCount)) : 0;
    return { total, avg, largest, smallest };
  }, [societies]);

  if (!circuit) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Society Membership Growth</h1>
        <Card>
          <CardContent className="py-8 text-center text-gray-600">No circuit assigned.</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Track Society Membership Growth</h1>
        <p className="text-gray-600 mt-1">{circuit.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total members</CardTitle>
            <HiOutlineUsers className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Societies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{societies.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg per society</CardTitle>
            <HiOutlineTrendingUp className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.avg}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Largest society</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.largest}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Society membership</CardTitle>
          <p className="text-sm text-gray-500">Update member counts in Manage Societies</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="pb-2 pr-4">Society</th>
                  <th className="pb-2 pr-4">Members</th>
                </tr>
              </thead>
              <tbody>
                {societies.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium text-gray-900">{s.name}</td>
                    <td className="py-3 pr-4">{s.memberCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
