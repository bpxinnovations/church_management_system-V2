'use client';

import { useState, useEffect, useRef } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlinePhotograph } from 'react-icons/hi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer } from '@/components/ui/drawer';
import {
  getCircuits,
  getSuperintendents,
  getCircuitById,
  createMinister,
  updateMinister,
  saveMinisters,
  getMinisters,
  updateCircuit,
} from '@/lib/diocese-circuit-storage';
import type { Minister } from '@/lib/diocese-circuit-storage';
import { useToast } from '@/lib/toast-context';
import { resizeImageToDataUrl } from '@/lib/image-upload';

const emptyForm = {
  name: '',
  title: '',
  email: '',
  phone: '',
  address: '',
  dateOfOrdination: '',
  education: '',
  languages: '',
  ministryStatement: '',
  appointmentStart: '',
  gender: '',
  imageDataUrl: '',
};

export default function DioceseSuperintendentsPage() {
  const [superintendents, setSuperintendents] = useState<Minister[]>([]);
  const [circuits, setCircuits] = useState(getCircuits());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const load = () => {
    setSuperintendents(getSuperintendents());
    setCircuits(getCircuits());
  };

  useEffect(() => {
    load();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    try {
      const dataUrl = await resizeImageToDataUrl(file, 300, 300, 0.85);
      setForm((f) => ({ ...f, imageDataUrl: dataUrl }));
    } catch {
      showToast('Failed to process image. Try a smaller file.', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('Name is required', 'error');
      return;
    }
    let imageDataUrl = form.imageDataUrl;
    if (imageFile && !imageDataUrl) {
      try {
        imageDataUrl = await resizeImageToDataUrl(imageFile, 300, 300, 0.85);
      } catch {
        showToast('Failed to process image', 'error');
        return;
      }
    }
    const data: Partial<Minister> = {
      name: form.name.trim(),
      type: 'superintendent',
      title: form.title.trim() || undefined,
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      address: form.address.trim() || undefined,
      dateOfOrdination: form.dateOfOrdination.trim() || undefined,
      education: form.education.trim() || undefined,
      languages: form.languages.trim() || undefined,
      ministryStatement: form.ministryStatement.trim() || undefined,
      appointmentStart: form.appointmentStart.trim() || undefined,
      gender: form.gender.trim() || undefined,
      imageDataUrl: imageDataUrl || undefined,
    };
    if (editingId) {
      updateMinister(editingId, data);
      showToast('Superintendent updated', 'success');
    } else {
      createMinister({
        name: form.name.trim(),
        type: 'superintendent',
        title: data.title,
        email: data.email,
        phone: data.phone,
        address: data.address,
        dateOfOrdination: data.dateOfOrdination,
        education: data.education,
        languages: data.languages,
        ministryStatement: data.ministryStatement,
        appointmentStart: data.appointmentStart,
        gender: data.gender,
        imageDataUrl: data.imageDataUrl,
      });
      showToast('Superintendent added', 'success');
    }
    setForm(emptyForm);
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
    load();
  };

  const handleEdit = (m: Minister) => {
    setEditingId(m.id);
    setForm({
      name: m.name,
      title: m.title ?? '',
      email: m.email ?? '',
      phone: m.phone ?? '',
      address: m.address ?? '',
      dateOfOrdination: m.dateOfOrdination ?? '',
      education: m.education ?? '',
      languages: m.languages ?? '',
      ministryStatement: m.ministryStatement ?? '',
      appointmentStart: m.appointmentStart ?? '',
      gender: m.gender ?? '',
      imageDataUrl: m.imageDataUrl ?? '',
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const assignedCircuit = circuits.find((c) => c.superintendentId === id);
    if (assignedCircuit && typeof window !== 'undefined') {
      if (!window.confirm(`${assignedCircuit.name} is assigned to this superintendent. Unassign and remove?`)) return;
      updateCircuit(assignedCircuit.id, { superintendentId: undefined });
    }
    if (typeof window !== 'undefined' && window.confirm('Remove this superintendent minister?')) {
      const all = getMinisters().filter((m) => m.id !== id);
      saveMinisters(all);
      showToast('Removed', 'success');
      load();
    }
  };

  const handleAssign = (circuitId: string, superintendentId: string) => {
    updateCircuit(circuitId, { superintendentId: superintendentId || undefined });
    setCircuits(getCircuits());
    showToast('Superintendent assigned', 'success');
  };

  const getCircuit = (id: string) => getCircuitById(id);
  const getName = (id: string | undefined) => superintendents.find((m) => m.id === id)?.name ?? '—';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Superintendent Ministers</h1>
          <p className="text-gray-600 mt-1">Add and manage superintendent ministers; assign them to circuits</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setImageFile(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2"
        >
          <HiOutlinePlus className="h-5 w-5" />
          Add Superintendent
        </Button>
      </div>

      <Drawer
        open={showForm}
        onClose={() => { setShowForm(false); setEditingId(null); setImageFile(null); }}
        title={editingId ? 'Edit Superintendent Minister' : 'Add Superintendent Minister'}
        width="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {/* Photo upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                {form.imageDataUrl ? (
                  <img src={form.imageDataUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <HiOutlinePhotograph className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  Upload image
                </Button>
                {form.imageDataUrl && (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, imageDataUrl: '' }))}
                    className="ml-2 text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Rev. John Mensah" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Reverend" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">— Select —</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <Input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Full address" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="email@church.org" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+233 ..." />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of ordination</label>
              <Input value={form.dateOfOrdination} onChange={(e) => setForm((f) => ({ ...f, dateOfOrdination: e.target.value }))} placeholder="e.g. 2010 or 2010-06-15" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Appointment start</label>
              <Input value={form.appointmentStart} onChange={(e) => setForm((f) => ({ ...f, appointmentStart: e.target.value }))} placeholder="e.g. 2022" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
            <Input value={form.education} onChange={(e) => setForm((f) => ({ ...f, education: e.target.value }))} placeholder="e.g. BD, Trinity Theological Seminary, 2008" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Languages spoken</label>
            <Input value={form.languages} onChange={(e) => setForm((f) => ({ ...f, languages: e.target.value }))} placeholder="e.g. English, Ga, Twi" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ministry statement / bio</label>
            <textarea
              value={form.ministryStatement}
              onChange={(e) => setForm((f) => ({ ...f, ministryStatement: e.target.value }))}
              placeholder="Brief ministry statement or biographical notes"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit">{editingId ? 'Update' : 'Add'}</Button>
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>
              Cancel
            </Button>
          </div>
        </form>
      </Drawer>

      <Card>
        <CardHeader>
          <CardTitle>Superintendent ministers</CardTitle>
          <p className="text-sm text-gray-500">Assign to circuits in the section below</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="pb-2 pr-4 w-14">Photo</th>
                  <th className="pb-2 pr-4">Name</th>
                  <th className="pb-2 pr-4">Title</th>
                  <th className="pb-2 pr-4">Contact</th>
                  <th className="pb-2 pr-4">Education</th>
                  <th className="pb-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {superintendents.map((m) => (
                  <tr key={m.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {m.imageDataUrl ? (
                          <img src={m.imageDataUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-500 text-xs font-medium">
                            {m.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-medium text-gray-900">{m.name}</td>
                    <td className="py-3 pr-4 text-gray-600">{m.title || '—'}</td>
                    <td className="py-3 pr-4 text-gray-600">
                      {[m.email, m.phone].filter(Boolean).join(' · ') || '—'}
                    </td>
                    <td className="py-3 pr-4 text-gray-600 max-w-[180px] truncate" title={m.education || ''}>
                      {m.education || '—'}
                    </td>
                    <td className="py-3 text-right">
                      <button onClick={() => handleEdit(m)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Edit">
                        <HiOutlinePencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded ml-1" title="Delete">
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {superintendents.length === 0 && (
            <p className="text-sm text-gray-500 mt-4">No superintendent ministers yet. Add one above.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assign superintendent to circuit</CardTitle>
          <p className="text-sm text-gray-500">Select a superintendent for each circuit</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {circuits.map((circuit) => {
              const current = getCircuit(circuit.id);
              return (
                <div
                  key={circuit.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50/50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{circuit.name}</p>
                    <p className="text-sm text-gray-500">Current: {getName(current?.superintendentId)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Superintendent:</label>
                    <select
                      value={current?.superintendentId ?? ''}
                      onChange={(e) => handleAssign(circuit.id, e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm min-w-[200px]"
                    >
                      <option value="">— None —</option>
                      {superintendents.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
