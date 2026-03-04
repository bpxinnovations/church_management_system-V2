'use client';

import { useMemo } from 'react';
import { HiOutlineTrendingUp, HiOutlineUsers, HiOutlineOfficeBuilding } from 'react-icons/hi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCircuits, getSocietiesByCircuitId } from '@/lib/diocese-circuit-storage';

export default function DiocesePerformancePage() {
  const circuits = getCircuits();
  const performance = useMemo(() => {
    const societies = circuits.map((c) => ({
      circuit: c,
      list: getSocietiesByCircuitId(c.id),
    }));
    return societies.map(({ circuit, list }) => {
      const totalMembers = list.reduce((s, n) => s + n.memberCount, 0);
      const avgPerSociety = list.length ? Math.round(totalMembers / list.length) : 0;
      const largest = list.length ? Math.max(...list.map((s) => s.memberCount)) : 0;
      return {
        circuit,
        societyCount: list.length,
        totalMembers,
        avgPerSociety,
        largestSociety: largest,
      };
    });
  }, [circuits]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Circuit Performance Dashboard</h1>
        <p className="text-gray-600 mt-1">Key metrics and performance by circuit</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Circuits</CardTitle>
            <HiOutlineOfficeBuilding className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{circuits.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Societies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {performance.reduce((s, n) => s + n.societyCount, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
            <HiOutlineUsers className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {performance.reduce((s, n) => s + n.totalMembers, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg per Society</CardTitle>
            <HiOutlineTrendingUp className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {performance.length
                ? Math.round(
                    performance.reduce((s, n) => s + n.totalMembers, 0) /
                      Math.max(1, performance.reduce((s, n) => s + n.societyCount, 0))
                  )
                : 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Circuit performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="pb-2 pr-4">Circuit</th>
                  <th className="pb-2 pr-4">Societies</th>
                  <th className="pb-2 pr-4">Total members</th>
                  <th className="pb-2 pr-4">Avg per society</th>
                  <th className="pb-2 pr-4">Largest society</th>
                </tr>
              </thead>
              <tbody>
                {performance.map((p) => (
                  <tr key={p.circuit.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium text-gray-900">{p.circuit.name}</td>
                    <td className="py-3 pr-4">{p.societyCount}</td>
                    <td className="py-3 pr-4">{p.totalMembers}</td>
                    <td className="py-3 pr-4">{p.avgPerSociety}</td>
                    <td className="py-3 pr-4">{p.largestSociety}</td>
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
