'use client';

import { useState, useEffect, useRef } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlinePhotograph } from 'react-icons/hi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer } from '@/components/ui/drawer';
import { useCircuitScope } from '@/lib/circuit-scope-context';
import {
  getMinisters,
  getSocietyMinisters,
  createMinister,
  updateMinister,
  saveMinisters,
} from '@/lib/diocese-circuit-storage';
import type { Minister, MinisterType } from '@/lib/diocese-circuit-storage';
import { useToast } from '@/lib/toast-context';
import { resizeImageToDataUrl } from '@/lib/image-upload';

const emptyForm = {
  name: '',
  type: 'minister' as MinisterType,
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
  notes: '',
  imageDataUrl: '',
};

export default function CircuitMinistersPage() {
  const { circuit } = useCircuitScope();
  const [ministers, setMinisters] = useState<Minister[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const load = () => setMinisters(getSocietyMinisters());

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
      type: form.type,
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
      notes: form.notes.trim() || undefined,
      imageDataUrl: imageDataUrl || undefined,
    };
    if (editingId) {
      updateMinister(editingId, data);
      showToast('Minister updated', 'success');
    } else {
      createMinister({
        name: form.name.trim(),
        type: form.type,
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
        notes: data.notes,
        imageDataUrl: data.imageDataUrl,
      });
      showToast('Minister added', 'success');
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
      type: m.type,
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
      notes: m.notes ?? '',
      imageDataUrl: m.imageDataUrl ?? '',
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (typeof window !== 'undefined' && window.confirm('Remove this minister/caretaker from the list?')) {
      const all = getMinisters().filter((m) => m.id !== id);
      saveMinisters(all);
      showToast('Removed', 'success');
      load();
    }
  };

  if (!circuit) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Ministers</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">Ministers</h1>
          <p className="text-gray-600 mt-1">Add and manage ministers and caretakers for {circuit.name}</p>
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
          Add Minister
        </Button>
      </div>

      <Drawer
        open={showForm}
        onClose={() => { setShowForm(false); setEditingId(null); setImageFile(null); }}
        title={editingId ? 'Edit Minister / Caretaker' : 'Add Minister / Caretaker'}
        width="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile photo</label>
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
                  Upload photo
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
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Rev. Grace Asante"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as MinisterType }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="minister">Minister</option>
                <option value="caretaker">Caretaker</option>
              </select>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Reverend, Brother, Sister"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <Input
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="Full address"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="email@church.org"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+233 24 123 4567"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of ordination</label>
              <Input
                value={form.dateOfOrdination}
                onChange={(e) => setForm((f) => ({ ...f, dateOfOrdination: e.target.value }))}
                placeholder="e.g. 2010 or 2010-06-15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Appointment start</label>
              <Input
                value={form.appointmentStart}
                onChange={(e) => setForm((f) => ({ ...f, appointmentStart: e.target.value }))}
                placeholder="e.g. 2022"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
            <Input
              value={form.education}
              onChange={(e) => setForm((f) => ({ ...f, education: e.target.value }))}
              placeholder="e.g. BD, Trinity Theological Seminary, 2008"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Languages spoken</label>
            <Input
              value={form.languages}
              onChange={(e) => setForm((f) => ({ ...f, languages: e.target.value }))}
              placeholder="e.g. English, Ga, Twi"
            />
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Any additional information"
              rows={2}
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
          <CardTitle>List of ministers & caretakers</CardTitle>
          <p className="text-sm text-gray-500">These can be assigned to societies when creating or editing a society.</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="pb-2 pr-4 w-14">Photo</th>
                  <th className="pb-2 pr-4">Name</th>
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2 pr-4">Title</th>
                  <th className="pb-2 pr-4">Contact</th>
                  <th className="pb-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ministers.map((m) => (
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
                    <td className="py-3 pr-4 capitalize">{m.type}</td>
                    <td className="py-3 pr-4 text-gray-600">{m.title || '—'}</td>
                    <td className="py-3 pr-4 text-gray-600">
                      {[m.email, m.phone].filter(Boolean).join(' · ') || '—'}
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
          {ministers.length === 0 && (
            <p className="text-sm text-gray-500 mt-4">No ministers or caretakers yet. Add one above.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
