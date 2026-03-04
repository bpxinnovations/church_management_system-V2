'use client';

import { useMemo } from 'react';
import { HiOutlineUsers, HiOutlineOfficeBuilding } from 'react-icons/hi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCircuits, getSocietiesByCircuitId } from '@/lib/diocese-circuit-storage';

export default function DioceseStatisticsPage() {
  const circuits = getCircuits();
  const stats = useMemo(() => {
    return circuits.map((c) => {
      const societies = getSocietiesByCircuitId(c.id);
      const memberCount = societies.reduce((s, n) => s + n.memberCount, 0);
      return {
        circuit: c,
        societyCount: societies.length,
        memberCount,
      };
    });
  }, [circuits]);

  const totals = useMemo(
    () => ({
      circuits: stats.length,
      societies: stats.reduce((s, n) => s + n.societyCount, 0),
      members: stats.reduce((s, n) => s + n.memberCount, 0),
    }),
    [stats]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Circuit Membership Statistics</h1>
        <p className="text-gray-600 mt-1">View membership across circuits</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Circuits</CardTitle>
            <HiOutlineOfficeBuilding className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totals.circuits}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Societies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totals.societies}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
            <HiOutlineUsers className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totals.members}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Per-circuit breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="pb-2 pr-4">Circuit</th>
                  <th className="pb-2 pr-4">Code</th>
                  <th className="pb-2 pr-4">Societies</th>
                  <th className="pb-2 pr-4">Members</th>
                </tr>
              </thead>
              <tbody>
                {stats.map(({ circuit, societyCount, memberCount }) => (
                  <tr key={circuit.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium text-gray-900">{circuit.name}</td>
                    <td className="py-3 pr-4 text-gray-600">{circuit.code || '—'}</td>
                    <td className="py-3 pr-4">{societyCount}</td>
                    <td className="py-3 pr-4">{memberCount}</td>
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
