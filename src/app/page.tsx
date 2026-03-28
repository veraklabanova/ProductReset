'use client';

import { workers, projects, allocations, zones } from '@/lib/data';
import { detectConflicts } from '@/lib/validation';
import { Users, FolderKanban, AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const conflicts = detectConflicts(allocations);
  const overcapacity = conflicts.filter((c) => c.type === 'overcapacity');
  const zoneConflicts = conflicts.filter((c) => c.type === 'zone');
  const activeWorkers = workers.filter((w) => w.active);
  const activeProjects = projects.filter((p) => p.status === 'active');

  const stats = [
    { label: 'Aktivni pracovnici', value: activeWorkers.length, total: workers.length, icon: Users, color: 'bg-blue-500', href: '/workers' },
    { label: 'Aktivni projekty', value: activeProjects.length, total: projects.length, icon: FolderKanban, color: 'bg-emerald-500', href: '/projects' },
    { label: 'Prekapacitni konflikty', value: overcapacity.length, icon: AlertTriangle, color: 'bg-red-500', href: '/heatmap' },
    { label: 'Zonove konflikty', value: zoneConflicts.length, icon: MapPin, color: 'bg-amber-500', href: '/heatmap' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Construction Capacity Manager v2.0 - Prehled systemu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              {stat.total && (
                <span className="text-sm text-slate-400">/ {stat.total}</span>
              )}
            </div>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Aktivni konflikty
          </h2>
          {conflicts.length === 0 ? (
            <div className="flex items-center gap-2 text-emerald-600 py-4">
              <CheckCircle className="w-5 h-5" />
              <span>Zadne konflikty</span>
            </div>
          ) : (
            <div className="space-y-3">
              {conflicts.slice(0, 6).map((conflict, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border-l-4 ${
                    conflict.type === 'overcapacity'
                      ? 'bg-red-50 border-red-500'
                      : 'bg-amber-50 border-amber-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {conflict.type === 'overcapacity' ? (
                      <Clock className="w-4 h-4 text-red-500" />
                    ) : (
                      <MapPin className="w-4 h-4 text-amber-500" />
                    )}
                    <span className="text-sm font-medium text-slate-700">
                      {conflict.type === 'overcapacity' ? 'Prekroceni 16h' : 'Zonovy konflikt'}
                    </span>
                    <span className="text-xs text-slate-400 ml-auto">{conflict.date}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{conflict.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            Prehled zon
          </h2>
          <div className="space-y-4">
            {zones.map((zone) => {
              const zoneWorkers = workers.filter((w) => w.zone === zone.id && w.active);
              const zoneProjects = projects.filter((p) => p.zone === zone.id && p.status === 'active');
              return (
                <div key={zone.id} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.color }} />
                    <span className="font-medium text-slate-700">{zone.name}</span>
                    <span className="text-xs text-slate-400">{zone.region}</span>
                  </div>
                  <div className="flex gap-6 text-sm text-slate-500">
                    <span>{zoneWorkers.length} pracovniku</span>
                    <span>{zoneProjects.length} projektu</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-emerald-500" />
            Aktivni projekty
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Projekt</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Klient</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Zona</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Obdobi</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => {
                  const zone = zones.find((z) => z.id === p.zone);
                  return (
                    <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-900">{p.name}</td>
                      <td className="py-3 px-4 text-slate-600">{p.client}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: zone?.color }} />
                          {zone?.name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          p.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                          p.status === 'planned' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {p.status === 'active' ? 'Aktivni' : p.status === 'planned' ? 'Planovany' : 'Dokonceny'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-xs">
                        {new Date(p.startDate).toLocaleDateString('cs-CZ')} - {new Date(p.endDate).toLocaleDateString('cs-CZ')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
