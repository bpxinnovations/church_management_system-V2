'use client';

import { useState, useEffect } from 'react';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCircuits, getCircuitFinancialSummaries } from '@/lib/diocese-circuit-storage';

export default function DioceseFinancialReportsPage() {
  const [summaries, setSummaries] = useState(getCircuitFinancialSummaries());
  const circuits = getCircuits();

  useEffect(() => {
    setSummaries(getCircuitFinancialSummaries());
  }, []);

  const byCircuit = circuits.map((c) => {
    const circuitSummaries = summaries.filter((s) => s.circuitId === c.id);
    const totalIncome = circuitSummaries.reduce((s, n) => s + n.totalIncome, 0);
    const totalExpenditure = circuitSummaries.reduce((s, n) => s + n.totalExpenditure, 0);
    return {
      circuit: c,
      totalIncome,
      totalExpenditure,
      balance: totalIncome - totalExpenditure,
      periods: circuitSummaries.length,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports per Circuit</h1>
        <p className="text-gray-600 mt-1">Income, expenditure and balance by circuit</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HiOutlineDocumentReport className="h-5 w-5" />
            Circuit financial summary
          </CardTitle>
          <p className="text-sm text-gray-500">Data is stored per period; add entries from the Circuit Finance dashboard (Circuit module) to see figures here.</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="pb-2 pr-4">Circuit</th>
                  <th className="pb-2 pr-4">Code</th>
                  <th className="pb-2 pr-4 text-right">Total Income</th>
                  <th className="pb-2 pr-4 text-right">Total Expenditure</th>
                  <th className="pb-2 pr-4 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {byCircuit.map(({ circuit, totalIncome, totalExpenditure, balance }) => (
                  <tr key={circuit.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium text-gray-900">{circuit.name}</td>
                    <td className="py-3 pr-4 text-gray-600">{circuit.code || '—'}</td>
                    <td className="py-3 pr-4 text-right text-gray-900">
                      GHS {totalIncome.toLocaleString()}
                    </td>
                    <td className="py-3 pr-4 text-right text-gray-900">
                      GHS {totalExpenditure.toLocaleString()}
                    </td>
                    <td className={`py-3 pr-4 text-right font-medium ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      GHS {balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {byCircuit.every((r) => r.totalIncome === 0 && r.totalExpenditure === 0) && (
            <p className="text-sm text-gray-500 mt-4">No financial data recorded yet. Circuit admins can record income and expenditure in the Circuit Finance dashboard.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
