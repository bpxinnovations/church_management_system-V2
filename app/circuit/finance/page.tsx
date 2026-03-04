'use client';

import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineDocumentReport } from 'react-icons/hi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer } from '@/components/ui/drawer';
import { useCircuitScope } from '@/lib/circuit-scope-context';
import {
  getCircuitFinancialSummaries,
  saveCircuitFinancialSummaries,
} from '@/lib/diocese-circuit-storage';
import type { CircuitFinancialSummary } from '@/lib/diocese-circuit-storage';
import { useToast } from '@/lib/toast-context';
export default function CircuitFinancePage() {
  const { circuitId, circuit } = useCircuitScope();
  const [summaries, setSummaries] = useState<CircuitFinancialSummary[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ period: '', totalIncome: 0, totalExpenditure: 0 });
  const { showToast } = useToast();

  const load = () => setSummaries(getCircuitFinancialSummaries().filter((s) => s.circuitId === circuitId));

  useEffect(() => {
    load();
  }, [circuitId]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const period = form.period || new Date().toISOString().slice(0, 7);
    const balance = form.totalIncome - form.totalExpenditure;
    const newEntry: CircuitFinancialSummary = {
      circuitId,
      period,
      totalIncome: form.totalIncome,
      totalExpenditure: form.totalExpenditure,
      balance,
    };
    const all = [...getCircuitFinancialSummaries(), newEntry];
    saveCircuitFinancialSummaries(all);
    showToast('Finance entry added', 'success');
    setForm({ period: new Date().toISOString().slice(0, 7), totalIncome: 0, totalExpenditure: 0 });
    setShowForm(false);
    load();
  };

  const totalIncome = summaries.reduce((s, n) => s + n.totalIncome, 0);
  const totalExpenditure = summaries.reduce((s, n) => s + n.totalExpenditure, 0);
  const balance = totalIncome - totalExpenditure;

  if (!circuit) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Circuit Finance Dashboard</h1>
        <Card>
          <CardContent className="py-8 text-center text-gray-600">No circuit assigned.</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Circuit Finance Dashboard</h1>
          <p className="text-gray-600 mt-1">{circuit.name}</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2">
          <HiOutlinePlus className="h-5 w-5" />
          Add entry
        </Button>
      </div>

      <Drawer open={showForm} onClose={() => setShowForm(false)} title="Add finance entry" width="md">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Period (YYYY-MM)</label>
            <Input
              type="month"
              value={form.period || new Date().toISOString().slice(0, 7)}
              onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total income (GHS)</label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={form.totalIncome || ''}
              onChange={(e) => setForm((f) => ({ ...f, totalIncome: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total expenditure (GHS)</label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={form.totalExpenditure || ''}
              onChange={(e) => setForm((f) => ({ ...f, totalExpenditure: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit">Add entry</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Drawer>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total income</CardTitle>
            <HiOutlineDocumentReport className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">GHS {totalIncome.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total expenditure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">GHS {totalExpenditure.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              GHS {balance.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>History by period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="pb-2 pr-4">Period</th>
                  <th className="pb-2 pr-4 text-right">Income</th>
                  <th className="pb-2 pr-4 text-right">Expenditure</th>
                  <th className="pb-2 pr-4 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {summaries.map((s) => (
                  <tr key={`${s.circuitId}-${s.period}`} className="border-b border-gray-100">
                    <td className="py-3 pr-4">{s.period}</td>
                    <td className="py-3 pr-4 text-right">GHS {s.totalIncome.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-right">GHS {s.totalExpenditure.toLocaleString()}</td>
                    <td className={`py-3 pr-4 text-right font-medium ${s.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      GHS {s.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {summaries.length === 0 && (
            <p className="text-sm text-gray-500 mt-4">No finance entries yet. Add an entry above.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
