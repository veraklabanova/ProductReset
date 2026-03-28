'use client';

import { useState } from 'react';
import { auditLog, workers, projects } from '@/lib/data';
import { ClipboardText, MagnifyingGlass, Warning, Clock, ShieldCheck, UserPlus, FolderPlus, ArrowsLeftRight, MapPin } from '@phosphor-icons/react';

const actionLabels: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  allocation_created: { label: 'Přiřazení', color: 'bg-blue-100 text-blue-700', icon: Clock },
  overcapacity_blocked: { label: 'Překapacita', color: 'bg-red-100 text-red-700', icon: Warning },
  zone_warning: { label: 'Zónový konflikt', color: 'bg-amber-100 text-amber-700', icon: MapPin },
  override_applied: { label: 'Přepis (override)', color: 'bg-purple-100 text-purple-700', icon: ShieldCheck },
  project_created: { label: 'Nový projekt', color: 'bg-emerald-100 text-emerald-700', icon: FolderPlus },
  worker_deactivated: { label: 'Deaktivace', color: 'bg-slate-100 text-slate-700', icon: UserPlus },
  bulk_move: { label: 'Hromadný přesun', color: 'bg-indigo-100 text-indigo-700', icon: ArrowsLeftRight },
};

export default function AuditPage() {
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const sorted = [...auditLog].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filtered = sorted.filter((entry) => {
    const matchSearch = entry.details.toLowerCase().includes(search.toLowerCase()) ||
      entry.user.toLowerCase().includes(search.toLowerCase());
    const matchAction = filterAction === 'all' || entry.action === filterAction;
    return matchSearch && matchAction;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ClipboardText className="w-8 h-8 text-slate-600" weight="duotone" />
            Audit Log
          </h1>
          <p className="text-slate-500 mt-1">Historie všech akcí a přepisů pravidel</p>
        </div>
      </div>

      {/* Filtry */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Hledat v logu…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Všechny akce</option>
          {Object.entries(actionLabels).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
      </div>

      {/* Záznamy logu */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="divide-y divide-slate-100">
          {filtered.map((entry) => {
            const actionInfo = actionLabels[entry.action] || { label: entry.action, color: 'bg-slate-100 text-slate-700', icon: Clock };
            const worker = entry.workerId ? workers.find((w) => w.id === entry.workerId) : null;
            const project = entry.projectId ? projects.find((p) => p.id === entry.projectId) : null;
            const Icon = actionInfo.icon;

            return (
              <div key={entry.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${actionInfo.color}`}>
                    <Icon className="w-4 h-4" weight="duotone" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${actionInfo.color}`}>
                        {actionInfo.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(entry.timestamp).toLocaleString('cs-CZ')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-900">{entry.details}</p>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-400">
                      <span>Uživatel: {entry.user}</span>
                      {worker && <span>Pracovník: {worker.name}</span>}
                      {project && <span>Projekt: {project.name}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
