'use client';

import { useState } from 'react';
import { workers as initialWorkers, zones } from '@/lib/data';
import { TEMPLATE_LABELS, Worker } from '@/lib/types';
import { MagnifyingGlass, Plus, Trash, CheckCircle, XCircle } from '@phosphor-icons/react';

export default function WorkersPage() {
  const [workerList, setWorkerList] = useState<Worker[]>(initialWorkers);
  const [search, setSearch] = useState('');
  const [filterZone, setFilterZone] = useState('all');

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
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Pracovníci</h1>
          <p className="text-slate-500 mt-1 text-sm">{filtered.length} pracovníků nalezeno</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-full sm:w-auto">
          <Plus className="w-4 h-4" weight="bold" />
          Přidat pracovníka
        </button>
      </div>

      {/* Filtry */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Hledat jméno nebo specializaci…"
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
          <option value="all">Všechny zóny</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>{z.name}</option>
          ))}
        </select>
      </div>

      {/* Mobilní karty / Desktop tabulka */}
      {/* Desktop tabulka */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="table-responsive">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Jméno</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Specializace</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Zóna</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Šablona</th>
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
                          w.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {w.active ? <CheckCircle className="w-3 h-3" weight="bold" /> : <XCircle className="w-3 h-3" weight="bold" />}
                        {w.active ? 'Aktivní' : 'Neaktivní'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleDelete(w.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded">
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobilní karty */}
      <div className="md:hidden space-y-3">
        {filtered.map((w) => {
          const zone = zones.find((z) => z.id === w.zone);
          return (
            <div key={w.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                    {w.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{w.name}</p>
                    <p className="text-xs text-slate-500">{w.specialization}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleActive(w.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    w.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {w.active ? <CheckCircle className="w-3 h-3" weight="bold" /> : <XCircle className="w-3 h-3" weight="bold" />}
                  {w.active ? 'Aktivní' : 'Neaktivní'}
                </button>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: zone?.color }} />
                  {zone?.name}
                </span>
                <span>{w.phone}</span>
                <span>{TEMPLATE_LABELS[w.template]}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
