'use client';

import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer } from '@/components/ui/drawer';
import {
  getCircuits,
  saveCircuits,
  createCircuit,
  updateCircuit,
  getCircuitById,
  getSocietiesByCircuitId,
  getSuperintendents,
} from '@/lib/diocese-circuit-storage';
import type { Circuit } from '@/lib/diocese-circuit-storage';
import { useToast } from '@/lib/toast-context';

const emptyForm = {
  name: '',
  code: '',
  area: '',
  address: '',
  contactPhone: '',
  contactEmail: '',
  societyCount: 0,
  establishedDate: '',
  superintendentId: '',
};

export default function DioceseCircuitsPage() {
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();

  const load = () => setCircuits(getCircuits());
  const superintendents = getSuperintendents();

  useEffect(() => {
    load();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('Circuit name is required', 'error');
      return;
    }
    const data = {
      name: form.name.trim(),
      code: form.code.trim() || undefined,
      area: form.area.trim() || undefined,
      address: form.address.trim() || undefined,
      contactPhone: form.contactPhone.trim() || undefined,
      contactEmail: form.contactEmail.trim() || undefined,
      societyCount: form.societyCount > 0 ? form.societyCount : undefined,
      establishedDate: form.establishedDate.trim() || undefined,
      superintendentId: form.superintendentId || undefined,
    };
    if (editingId) {
      updateCircuit(editingId, data);
      showToast('Circuit updated', 'success');
    } else {
      createCircuit(data);
      showToast('Circuit created', 'success');
    }
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    load();
  };

  const handleEdit = (c: Circuit) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      code: c.code ?? '',
      area: c.area ?? '',
      address: c.address ?? '',
      contactPhone: c.contactPhone ?? '',
      contactEmail: c.contactEmail ?? '',
      societyCount: c.societyCount ?? 0,
      establishedDate: c.establishedDate ?? '',
      superintendentId: c.superintendentId ?? '',
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const societies = getSocietiesByCircuitId(id);
    if (societies.length > 0) {
      showToast(`Cannot delete: ${societies.length} societ(ies) belong to this circuit.`, 'error');
      return;
    }
    if (typeof window !== 'undefined' && window.confirm('Delete this circuit?')) {
      saveCircuits(circuits.filter((c) => c.id !== id));
      showToast('Circuit deleted', 'success');
      load();
    }
  };

  const getSuperintendentName = (id: string | undefined) => superintendents.find((m) => m.id === id)?.name ?? '—';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Circuits</h1>
          <p className="text-gray-600 mt-1">Create and manage circuits in the diocese</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2"
        >
          <HiOutlinePlus className="h-5 w-5" />
          Add Circuit
        </Button>
      </div>

      <Drawer
        open={showForm}
        onClose={() => { setShowForm(false); setEditingId(null); }}
        title={editingId ? 'Edit Circuit' : 'New Circuit'}
        width="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Circuit name *</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Accra Central Circuit"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <Input
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              placeholder="e.g. ACC"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
            <Input
              value={form.area}
              onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
              placeholder="e.g. Greater Accra, Ashanti"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Circuit office address</label>
            <Input
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="Full address"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact phone</label>
              <Input
                value={form.contactPhone}
                onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
                placeholder="+233 ..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact email</label>
              <Input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                placeholder="circuit@church.org"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of circuit societies</label>
              <Input
                type="number"
                min={0}
                value={form.societyCount || ''}
                onChange={(e) => setForm((f) => ({ ...f, societyCount: parseInt(e.target.value, 10) || 0 }))}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Established date</label>
              <Input
                value={form.establishedDate}
                onChange={(e) => setForm((f) => ({ ...f, establishedDate: e.target.value }))}
                placeholder="e.g. 1995 or 1995-01-01"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Superintendent minister</label>
            <select
              value={form.superintendentId}
              onChange={(e) => setForm((f) => ({ ...f, superintendentId: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">— None —</option>
              {superintendents.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>
              Cancel
            </Button>
          </div>
        </form>
      </Drawer>

      <Card>
        <CardHeader>
          <CardTitle>Circuits</CardTitle>
          <p className="text-sm text-gray-500">Assign superintendents on this form or from Superintendent Ministers page</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="pb-2 pr-4">Name</th>
                  <th className="pb-2 pr-4">Code</th>
                  <th className="pb-2 pr-4">Area</th>
                  <th className="pb-2 pr-4">Societies</th>
                  <th className="pb-2 pr-4">No. societies</th>
                  <th className="pb-2 pr-4">Superintendent</th>
                  <th className="pb-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {circuits.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium text-gray-900">{c.name}</td>
                    <td className="py-3 pr-4 text-gray-600">{c.code || '—'}</td>
                    <td className="py-3 pr-4 text-gray-600">{c.area || '—'}</td>
                    <td className="py-3 pr-4">{getSocietiesByCircuitId(c.id).length}</td>
                    <td className="py-3 pr-4">{c.societyCount ?? '—'}</td>
                    <td className="py-3 pr-4 text-gray-600">{getSuperintendentName(c.superintendentId)}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => handleEdit(c)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Edit">
                        <HiOutlinePencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded ml-1" title="Delete">
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </td>
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
