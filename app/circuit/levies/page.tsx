'use client';

import { useState, useEffect } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer } from '@/components/ui/drawer';
import { useCircuitScope } from '@/lib/circuit-scope-context';
import {
  getCircuitById,
  getSocietiesByCircuitId,
  getLevies,
  saveLevies,
  getLeviesBySocietyId,
} from '@/lib/diocese-circuit-storage';
import type { SocietyLevy } from '@/lib/diocese-circuit-storage';
import { useToast } from '@/lib/toast-context';
import { generateId } from '@/lib/rbac-storage';

export default function CircuitLeviesPage() {
  const { circuitId, circuit } = useCircuitScope();
  const societies = circuit ? getSocietiesByCircuitId(circuit.id) : [];
  const [levies, setLevies] = useState<SocietyLevy[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ societyId: '', amount: 0, period: '' });
  const { showToast } = useToast();

  const load = () => setLevies(getLevies());

  useEffect(() => {
    load();
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.societyId || form.amount <= 0) {
      showToast('Select society and enter amount', 'error');
      return;
    }
    const period = form.period || new Date().toISOString().slice(0, 7);
    const newLevy: SocietyLevy = {
      id: generateId(),
      societyId: form.societyId,
      amount: form.amount,
      period,
      status: 'pending',
    };
    const all = [...getLevies(), newLevy];
    saveLevies(all);
    showToast('Levy recorded', 'success');
    setForm({ societyId: '', amount: 0, period: new Date().toISOString().slice(0, 7) });
    setShowForm(false);
    load();
  };

  const markPaid = (id: string) => {
    const all = getLevies().map((l) => (l.id === id ? { ...l, status: 'paid' as const, paidAt: new Date().toISOString() } : l));
    saveLevies(all);
    showToast('Marked as paid', 'success');
    load();
  };

  const getSocietyName = (id: string) => societies.find((s) => s.id === id)?.name ?? id;

  if (!circuit) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Society Levies</h1>
        <Card>
          <CardContent className="py-8 text-center text-gray-600">No circuit assigned.</CardContent>
        </Card>
      </div>
    );
  }

  const circuitLevies = levies.filter((l) => societies.some((s) => s.id === l.societyId));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collect Society Levies</h1>
          <p className="text-gray-600 mt-1">Record and track society levies for {circuit.name}</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2">
          <HiOutlinePlus className="h-5 w-5" />
          Add Levy
        </Button>
      </div>

      <Drawer open={showForm} onClose={() => setShowForm(false)} title="Record levy" width="md">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Society</label>
            <select
              value={form.societyId}
              onChange={(e) => setForm((f) => ({ ...f, societyId: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            >
              <option value="">Select society</option>
              {societies.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (GHS)</label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={form.amount || ''}
              onChange={(e) => setForm((f) => ({ ...f, amount: parseFloat(e.target.value) || 0 }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Period (YYYY-MM)</label>
            <Input
              type="month"
              value={form.period || new Date().toISOString().slice(0, 7)}
              onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit">Add Levy</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Drawer>

      <Card>
        <CardHeader>
          <CardTitle>Levy records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="pb-2 pr-4">Society</th>
                  <th className="pb-2 pr-4">Period</th>
                  <th className="pb-2 pr-4 text-right">Amount</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {circuitLevies.map((l) => (
                  <tr key={l.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium text-gray-900">{getSocietyName(l.societyId)}</td>
                    <td className="py-3 pr-4">{l.period}</td>
                    <td className="py-3 pr-4 text-right">GHS {l.amount.toLocaleString()}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={
                          l.status === 'paid'
                            ? 'text-green-600'
                            : l.status === 'overdue'
                              ? 'text-red-600'
                              : 'text-amber-600'
                        }
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {l.status === 'pending' && (
                        <button
                          onClick={() => markPaid(l.id)}
                          className="text-sm text-green-600 hover:underline"
                        >
                          Mark paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {circuitLevies.length === 0 && (
            <p className="text-sm text-gray-500 mt-4">No levy records yet. Add a levy above.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
