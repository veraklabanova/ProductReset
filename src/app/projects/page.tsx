'use client';

import { useState } from 'react';
import { projects as initialProjects, zones, workers, allocations } from '@/lib/data';
import { TEMPLATE_LABELS } from '@/lib/types';
import { FolderKanban, Search, Users, Calendar } from 'lucide-react';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = initialProjects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projekty</h1>
          <p className="text-slate-500 mt-1">{filtered.length} projektu</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Hledat projekt nebo klienta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Vsechny statusy</option>
          <option value="active">Aktivni</option>
          <option value="planned">Planovane</option>
          <option value="completed">Dokoncene</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((p) => {
          const zone = zones.find((z) => z.id === p.zone);
          const projectAllocations = allocations.filter((a) => a.projectId === p.id);
          const uniqueWorkers = new Set(projectAllocations.map((a) => a.workerId));
          return (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">{p.name}</h3>
                  <p className="text-sm text-slate-500">{p.client}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  p.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                  p.status === 'planned' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {p.status === 'active' ? 'Aktivni' : p.status === 'planned' ? 'Planovany' : 'Dokonceny'}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zone?.color }} />
                  <span>{zone?.name} ({zone?.region})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{new Date(p.startDate).toLocaleDateString('cs-CZ')} - {new Date(p.endDate).toLocaleDateString('cs-CZ')}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{uniqueWorkers.size} prirzenych pracovniku</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <FolderKanban className="w-4 h-4 text-slate-400" />
                  <span className="text-xs">{TEMPLATE_LABELS[p.template]}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex gap-2">
                  {Array.from(uniqueWorkers).slice(0, 5).map((wId) => {
                    const w = workers.find((wr) => wr.id === wId);
                    return w ? (
                      <div key={w.id} className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold" title={w.name}>
                        {w.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                    ) : null;
                  })}
                  {uniqueWorkers.size > 5 && (
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs">
                      +{uniqueWorkers.size - 5}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
