'use client';

import { useState, useMemo } from 'react';
import { workers, allocations } from '@/lib/data';
import { getWorkerHoursOnDate, getWorkerZonesOnDate, formatDate } from '@/lib/validation';
import { CaretLeft, CaretRight, Fire } from '@phosphor-icons/react';

export default function HeatmapPage() {
  const [weekOffset, setWeekOffset] = useState(0);

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

  type CellStatus = 'empty' | 'ok' | 'warning' | 'danger';

  function getCellStatus(workerId: string, date: string): { status: CellStatus; hours: number; zoneCount: number } {
    const hours = getWorkerHoursOnDate(allocations, workerId, date);
    const zoneIds = getWorkerZonesOnDate(allocations, workerId, date);
    if (hours === 0) return { status: 'empty', hours: 0, zoneCount: 0 };
    if (hours > 16) return { status: 'danger', hours, zoneCount: zoneIds.length };
    if (zoneIds.length > 1) return { status: 'warning', hours, zoneCount: zoneIds.length };
    return { status: 'ok', hours, zoneCount: zoneIds.length };
  }

  const statusColors: Record<CellStatus, string> = {
    empty: 'bg-slate-50',
    ok: 'bg-emerald-100 border-emerald-200',
    warning: 'bg-amber-200 border-amber-300',
    danger: 'bg-red-300 border-red-400',
  };

  const statusTextColors: Record<CellStatus, string> = {
    empty: 'text-slate-300',
    ok: 'text-emerald-700',
    warning: 'text-amber-800',
    danger: 'text-red-900 font-bold',
  };

  const summary = useMemo(() => {
    let ok = 0, warning = 0, danger = 0;
    for (const w of activeWorkers) {
      for (const day of weekDays) {
        const { status } = getCellStatus(w.id, day);
        if (status === 'ok') ok++;
        if (status === 'warning') warning++;
        if (status === 'danger') danger++;
      }
    }
    return { ok, warning, danger };
  }, [weekOffset]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Fire className="w-8 h-8 text-orange-500" weight="duotone" />
            Konfliktní heatmapa
          </h1>
          <p className="text-slate-500 mt-1">Vizuální přehled kapacit a konfliktů</p>
        </div>
      </div>

      {/* Souhrn */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
          <div className="w-4 h-4 rounded bg-emerald-200" />
          <span className="text-sm font-medium text-emerald-700">{summary.ok} OK</span>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          <div className="w-4 h-4 rounded bg-amber-200" />
          <span className="text-sm font-medium text-amber-700">{summary.warning} Zónové konflikty</span>
        </div>
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          <div className="w-4 h-4 rounded bg-red-300" />
          <span className="text-sm font-medium text-red-700">{summary.danger} Překapacity</span>
        </div>
      </div>

      {/* Navigace po týdnech */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
          <button onClick={() => setWeekOffset((o) => o - 1)} className="p-2 hover:bg-slate-100 rounded">
            <CaretLeft className="w-4 h-4" weight="bold" />
          </button>
          <span className="text-sm font-medium px-3 min-w-[180px] text-center">
            {formatDate(weekDays[0])} – {formatDate(weekDays[4])}
          </span>
          <button onClick={() => setWeekOffset((o) => o + 1)} className="p-2 hover:bg-slate-100 rounded">
            <CaretRight className="w-4 h-4" weight="bold" />
          </button>
        </div>
        <button onClick={() => setWeekOffset(0)} className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
          Dnes
        </button>
      </div>

      {/* Heatmapa */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left py-3 px-4 font-medium text-slate-500 border-b border-r border-slate-200 min-w-[160px] sticky left-0 bg-slate-50 z-10">
                Pracovník
              </th>
              {weekDays.map((day) => (
                <th key={day} className="text-center py-3 px-2 font-medium text-slate-500 border-b border-r border-slate-200 min-w-[120px]">
                  {formatDate(day)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeWorkers.map((worker) => (
              <tr key={worker.id}>
                <td className="py-2 px-4 border-b border-r border-slate-200 sticky left-0 bg-white z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">
                      {worker.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="text-xs font-medium text-slate-700">{worker.name}</span>
                  </div>
                </td>
                {weekDays.map((day) => {
                  const { status, hours, zoneCount } = getCellStatus(worker.id, day);
                  return (
                    <td
                      key={day}
                      className={`py-3 px-2 border-b border-r border-slate-200 text-center transition-colors ${statusColors[status]}`}
                      title={status === 'empty' ? 'Bez přiřazení' :
                        `${hours}h${zoneCount > 1 ? ` / ${zoneCount} zóny` : ''}`}
                    >
                      <span className={`text-sm font-mono ${statusTextColors[status]}`}>
                        {status === 'empty' ? '–' : `${hours}h`}
                      </span>
                      {zoneCount > 1 && (
                        <div className="text-[10px] text-amber-600 mt-0.5">{zoneCount} zóny</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
