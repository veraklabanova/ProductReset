'use client';

import { useState, useMemo } from 'react';
import { workers, projects, allocations as initialAllocations, zones } from '@/lib/data';
import { Allocation, SLOT_LABELS, SLOT_HOURS, TimeSlot } from '@/lib/types';
import { getWorkerHoursOnDate, getWorkerZonesOnDate, formatDate, validateAllocation } from '@/lib/validation';
import { CaretLeft, CaretRight, Warning, Clock, MapPin, Plus, X, ShieldCheck } from '@phosphor-icons/react';

export default function CalendarPage() {
  const [allocs, setAllocs] = useState<Allocation[]>(initialAllocations);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedWorker, setSelectedWorker] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<{ workerId: string; date: string } | null>(null);
  const [addSlot, setAddSlot] = useState<TimeSlot>('AM');
  const [addProject, setAddProject] = useState('p1');
  const [addError, setAddError] = useState<string | null>(null);

  const baseDate = useMemo(() => {
    const d = new Date('2026-03-23');
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  }, [weekOffset]);

  const weekDays = useMemo(() => {
    const days: string[] = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  }, [baseDate]);

  const activeWorkers = workers.filter((w) => w.active);
  const displayWorkers = selectedWorker === 'all'
    ? activeWorkers
    : activeWorkers.filter((w) => w.id === selectedWorker);

  const handleAddAllocation = () => {
    if (!showAddModal) return;
    const validation = validateAllocation(allocs, showAddModal.workerId, showAddModal.date, SLOT_HOURS[addSlot]);
    if (!validation.valid) {
      setAddError(validation.error || 'Chyba validace');
      return;
    }
    const newAlloc: Allocation = {
      id: `a_new_${Date.now()}`,
      workerId: showAddModal.workerId,
      projectId: addProject,
      date: showAddModal.date,
      slot: addSlot,
    };
    setAllocs((prev) => [...prev, newAlloc]);
    setShowAddModal(null);
    setAddError(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Kalendář přiřazení</h1>
        <p className="text-slate-500 mt-1 text-sm">Týdenní přehled alokace pracovníků</p>
      </div>

      {/* Ovládání */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
          <button onClick={() => setWeekOffset((o) => o - 1)} className="p-2 hover:bg-slate-100 rounded">
            <CaretLeft className="w-4 h-4" weight="bold" />
          </button>
          <span className="text-sm font-medium px-2 sm:px-3 flex-1 text-center whitespace-nowrap">
            {formatDate(weekDays[0])} – {formatDate(weekDays[4])}
          </span>
          <button onClick={() => setWeekOffset((o) => o + 1)} className="p-2 hover:bg-slate-100 rounded">
            <CaretRight className="w-4 h-4" weight="bold" />
          </button>
          <button onClick={() => setWeekOffset(0)} className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
            Dnes
          </button>
        </div>
        <select
          value={selectedWorker}
          onChange={(e) => setSelectedWorker(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Všichni pracovníci</option>
          {activeWorkers.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-300" /> Normální</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-100 border border-red-300" /> Překročení 16h</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" /> Zónový konflikt</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-purple-100 border border-purple-300" /> Přepis</span>
      </div>

      {/* Kalendářní mřížka */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-auto">
        <table className="w-full text-sm border-collapse min-w-[680px]">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-slate-500 border-b border-r border-slate-200 min-w-[110px] sm:min-w-[160px] sticky left-0 bg-slate-50 z-10">
                Pracovník
              </th>
              {weekDays.map((day) => (
                <th key={day} className="text-center py-2 sm:py-3 px-1 sm:px-2 font-medium text-slate-500 border-b border-r border-slate-200 min-w-[110px] sm:min-w-[180px]">
                  <span className="text-xs sm:text-sm">{formatDate(day)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayWorkers.map((worker) => (
              <tr key={worker.id} className="hover:bg-slate-50/50">
                <td className="py-1 sm:py-2 px-2 sm:px-4 border-b border-r border-slate-200 sticky left-0 bg-white z-10">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] sm:text-xs font-bold flex-shrink-0">
                      {worker.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 text-[11px] sm:text-xs truncate">{worker.name}</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">{worker.specialization}</p>
                    </div>
                  </div>
                </td>
                {weekDays.map((day) => {
                  const dayAllocs = allocs.filter((a) => a.workerId === worker.id && a.date === day);
                  const totalHours = getWorkerHoursOnDate(allocs, worker.id, day);
                  const zoneIds = getWorkerZonesOnDate(allocs, worker.id, day);
                  const hasOvercapacity = totalHours > 16;
                  const hasZoneConflict = zoneIds.length > 1;

                  return (
                    <td key={day} className={`py-1 px-1 sm:px-2 border-b border-r border-slate-200 align-top ${
                      hasOvercapacity ? 'bg-red-50' : hasZoneConflict ? 'bg-amber-50' : ''
                    }`}>
                      <div className="space-y-0.5 sm:space-y-1">
                        {dayAllocs.map((a) => {
                          const project = projects.find((p) => p.id === a.projectId);
                          return (
                            <div
                              key={a.id}
                              className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs border ${
                                a.override
                                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                                  : hasOvercapacity
                                  ? 'bg-red-100 border-red-200 text-red-700'
                                  : hasZoneConflict
                                  ? 'bg-amber-100 border-amber-200 text-amber-700'
                                  : 'bg-blue-50 border-blue-200 text-blue-700'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-0.5">
                                <span className="font-medium truncate">{project?.name}</span>
                                {a.override && <ShieldCheck className="w-3 h-3 text-purple-500 flex-shrink-0" weight="fill" />}
                              </div>
                              <span className="text-[9px] sm:text-[10px] opacity-70">{SLOT_LABELS[a.slot]}</span>
                            </div>
                          );
                        })}
                        {dayAllocs.length > 0 && (
                          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className={totalHours > 16 ? 'text-red-600 font-bold' : 'text-slate-400'}>
                              {totalHours}h/16h
                            </span>
                            {hasOvercapacity && <Warning className="w-3 h-3 text-red-500" weight="fill" />}
                            {hasZoneConflict && <MapPin className="w-3 h-3 text-amber-500" weight="fill" />}
                          </div>
                        )}
                        <button
                          onClick={() => { setShowAddModal({ workerId: worker.id, date: day }); setAddError(null); }}
                          className="w-full py-0.5 text-[9px] sm:text-[10px] text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded flex items-center justify-center gap-0.5"
                        >
                          <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="hidden sm:inline">Přidat</span>
                        </button>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modální okno */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl p-5 sm:p-6 w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Přidat přiřazení</h3>
              <button onClick={() => setShowAddModal(null)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pracovník</label>
                <p className="text-sm text-slate-600">{workers.find((w) => w.id === showAddModal.workerId)?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Datum</label>
                <p className="text-sm text-slate-600">{formatDate(showAddModal.date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slot</label>
                <select
                  value={addSlot}
                  onChange={(e) => setAddSlot(e.target.value as TimeSlot)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm"
                >
                  {(Object.keys(SLOT_LABELS) as TimeSlot[]).map((s) => (
                    <option key={s} value={s}>{SLOT_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Projekt</label>
                <select
                  value={addProject}
                  onChange={(e) => setAddProject(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              {addError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                  <Warning className="w-4 h-4 flex-shrink-0" weight="fill" />
                  {addError}
                </div>
              )}
              <button
                onClick={handleAddAllocation}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Přidat přiřazení
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
