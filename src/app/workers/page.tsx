'use client';

import { useState } from 'react';
import { workers as initialWorkers, zones } from '@/lib/data';
import { TEMPLATE_LABELS, Worker } from '@/lib/types';
import { Users, Search, Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function WorkersPage() {
  const [workerList, setWorkerList] = useState<Worker[]>(initialWorkers);
  const [search, setSearch] = useState('');
  const [filterZone, setFilterZone] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const filtered = workerList.filter((w) => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.specialization.toLowerCase().includes(search.toLowerCase());
    const matchZone = filterZone === 'all' || w.zone === filterZone;
    return matchSearch && matchZone;
  });

  const handleToggleActive = (id: string) => {
    setWorkerList((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    );
  };

  const handleDelete = (id: string) => {
    setWorkerList((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pracovnici</h1>
          <p className="text-slate-500 mt-1">{filtered.length} pracovniku nalezeno</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Pridat pracovnika
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Hledat jmeno nebo specializaci..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterZone}
          onChange={(e) => setFilterZone(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Vsechny zony</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>{z.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-slate-500">Jmeno</th>
              <th className="text-left py-3 px-4 font-medium text-slate-500">Specializace</th>
              <th className="text-left py-3 px-4 font-medium text-slate-500">Zona</th>
              <th className="text-left py-3 px-4 font-medium text-slate-500">Sablona</th>
              <th className="text-left py-3 px-4 font-medium text-slate-500">Telefon</th>
              <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
              <th className="text-left py-3 px-4 font-medium text-slate-500">Akce</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => {
              const zone = zones.find((z) => z.id === w.zone);
              return (
                <tr key={w.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                        {w.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className="font-medium text-slate-900">{w.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{w.specialization}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: zone?.color }} />
                      {zone?.name}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{TEMPLATE_LABELS[w.template]}</td>
                  <td className="py-3 px-4 text-slate-500">{w.phone}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(w.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer ${
                        w.active
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {w.active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {w.active ? 'Aktivni' : 'Neaktivni'}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(w.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
