'use client';

import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer } from '@/components/ui/drawer';
import { useCircuitScope } from '@/lib/circuit-scope-context';
import {
  getSocietiesByCircuitId,
  createSociety,
  updateSociety,
  saveSocieties,
  getSocieties,
  getSocietyMinisters,
} from '@/lib/diocese-circuit-storage';
import type { Society } from '@/lib/diocese-circuit-storage';
import { useToast } from '@/lib/toast-context';

const emptyForm = {
  name: '',
  location: '',
  address: '',
  contactPhone: '',
  memberCount: 0,
  ministerId: '',
};

export default function CircuitSocietiesPage() {
  const { circuitId, circuit } = useCircuitScope();
  const cid = circuitId ?? '';
  const [societies, setSocieties] = useState<Society[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();

  const ministers = getSocietyMinisters();
  const load = () => setSocieties(getSocietiesByCircuitId(cid));

  useEffect(() => {
    load();
  }, [cid]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('Society name is required', 'error');
      return;
    }
    if (!cid) {
      showToast('No circuit assigned', 'error');
      return;
    }
    const data = {
      name: form.name.trim(),
      location: form.location.trim() || undefined,
      address: form.address.trim() || undefined,
      contactPhone: form.contactPhone.trim() || undefined,
      memberCount: form.memberCount,
      ministerId: form.ministerId || undefined,
    };
    if (editingId) {
      updateSociety(editingId, data);
      showToast('Society updated', 'success');
    } else {
      createSociety({ circuitId: cid, ...data });
      showToast('Society created', 'success');
    }
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    load();
  };

  const handleEdit = (s: Society) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      location: s.location ?? '',
      address: s.address ?? '',
      contactPhone: s.contactPhone ?? '',
      memberCount: s.memberCount,
      ministerId: s.ministerId ?? '',
    });
    setShowForm(true);
  };

  const closeDrawer = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (typeof window !== 'undefined' && window.confirm('Delete this society?')) {
      const all = getSocieties().filter((s) => s.id !== id);
      saveSocieties(all);
      showToast('Society deleted', 'success');
      load();
    }
  };

  const getMinisterLabel = (id: string | undefined) => {
    if (!id) return '—';
    const m = ministers.find((x) => x.id === id);
    return m ? `${m.name} (${m.type})` : '—';
  };

  if (!circuit) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Societies</h1>
        <Card>
          <CardContent className="py-8 text-center text-gray-600">
            No circuit assigned. Contact the Diocese admin.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Societies</h1>
          <p className="text-gray-600 mt-1">Create and manage societies in {circuit.name}</p>
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
          Add Society
        </Button>
      </div>

      <Drawer
        open={showForm}
        onClose={closeDrawer}
        title={editingId ? 'Edit Society' : 'New Society'}
        width="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Society name *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Bethel Society"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Accra Central, East Legon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Full address (street, area)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact phone</label>
                <Input
                  value={form.contactPhone}
                  onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
                  placeholder="e.g. +233 24 123 4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member count</label>
                <Input
                  type="number"
                  min={0}
                  value={form.memberCount}
                  onChange={(e) => setForm((f) => ({ ...f, memberCount: parseInt(e.target.value, 10) || 0 }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minister / Caretaker</label>
                <select
                  value={form.ministerId}
                  onChange={(e) => setForm((f) => ({ ...f, ministerId: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">— None —</option>
                  {ministers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.type})
                      {m.title ? ` – ${m.title}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={closeDrawer}>
                  Cancel
                </Button>
              </div>
            </form>
      </Drawer>

      <Card>
        <CardHeader>
          <CardTitle>Societies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="pb-2 pr-4">Name</th>
                  <th className="pb-2 pr-4">Location</th>
                  <th className="pb-2 pr-4">Members</th>
                  <th className="pb-2 pr-4">Minister / Caretaker</th>
                  <th className="pb-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {societies.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium text-gray-900">{s.name}</td>
                    <td className="py-3 pr-4 text-gray-600">{s.location || '—'}</td>
                    <td className="py-3 pr-4">{s.memberCount}</td>
                    <td className="py-3 pr-4 text-gray-600">{getMinisterLabel(s.ministerId)}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => handleEdit(s)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Edit">
                        <HiOutlinePencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded ml-1" title="Delete">
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
