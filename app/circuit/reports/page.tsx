'use client';

import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineDocumentText } from 'react-icons/hi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer } from '@/components/ui/drawer';
import { useCircuitScope } from '@/lib/circuit-scope-context';
import {
  getSocietiesByCircuitId,
  getSocietyReports,
  saveSocietyReports,
} from '@/lib/diocese-circuit-storage';
import type { SocietyReport } from '@/lib/diocese-circuit-storage';
import { useToast } from '@/lib/toast-context';
import { generateId } from '@/lib/rbac-storage';

export default function CircuitReportsPage() {
  const { circuit, circuitId } = useCircuitScope();
  const societies = circuit ? getSocietiesByCircuitId(circuit.id) : [];
  const [reports, setReports] = useState<SocietyReport[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ societyId: '', title: '', period: '' });
  const { showToast } = useToast();

  const load = () => {
    const all = getSocietyReports();
    setReports(all.filter((r) => societies.some((s) => s.id === r.societyId)));
  };

  useEffect(() => {
    load();
  }, [circuitId ?? '']);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.societyId || !form.title.trim()) {
      showToast('Society and title required', 'error');
      return;
    }
    const newReport: SocietyReport = {
      id: generateId(),
      societyId: form.societyId,
      title: form.title.trim(),
      period: form.period || new Date().toISOString().slice(0, 7),
      uploadedAt: new Date().toISOString(),
    };
    const all = [...getSocietyReports(), newReport];
    saveSocietyReports(all);
    showToast('Report recorded', 'success');
    setForm({ societyId: '', title: '', period: new Date().toISOString().slice(0, 7) });
    setShowForm(false);
    load();
  };

  const getSocietyName = (id: string) => societies.find((s) => s.id === id)?.name ?? id;

  if (!circuit) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Upload Society Reports</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">Upload Society Reports</h1>
          <p className="text-gray-600 mt-1">Record society reports for {circuit.name}</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2">
          <HiOutlinePlus className="h-5 w-5" />
          Add report
        </Button>
      </div>

      <Drawer open={showForm} onClose={() => setShowForm(false)} title="Record report" width="md">
        <form onSubmit={handleUpload} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Report title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Monthly activity report"
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
            <Button type="submit">Save report</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Drawer>

      <Card>
        <CardHeader>
          <CardTitle>Society reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="pb-2 pr-4">Society</th>
                  <th className="pb-2 pr-4">Title</th>
                  <th className="pb-2 pr-4">Period</th>
                  <th className="pb-2 pr-4">Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium text-gray-900">{getSocietyName(r.societyId)}</td>
                    <td className="py-3 pr-4">{r.title}</td>
                    <td className="py-3 pr-4">{r.period}</td>
                    <td className="py-3 pr-4 text-gray-500">
                      {new Date(r.uploadedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {reports.length === 0 && (
            <p className="text-sm text-gray-500 mt-4">No reports yet. Add a report above.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
