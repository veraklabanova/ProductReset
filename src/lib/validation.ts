import { Allocation, Conflict, SLOT_HOURS, Worker, Project } from './types';
import { projects, zones, workers } from './data';

export function getWorkerHoursOnDate(
  allocs: Allocation[],
  workerId: string,
  date: string
): number {
  return allocs
    .filter((a) => a.workerId === workerId && a.date === date)
    .reduce((sum, a) => sum + SLOT_HOURS[a.slot], 0);
}

export function getWorkerZonesOnDate(
  allocs: Allocation[],
  workerId: string,
  date: string
): string[] {
  const projectIds = [
    ...new Set(
      allocs
        .filter((a) => a.workerId === workerId && a.date === date)
        .map((a) => a.projectId)
    ),
  ];
  const zoneIds = [
    ...new Set(
      projectIds.map((pid) => projects.find((p) => p.id === pid)?.zone).filter(Boolean)
    ),
  ] as string[];
  return zoneIds;
}

export function validateAllocation(
  allocs: Allocation[],
  workerId: string,
  date: string,
  newSlotHours: number
): { valid: boolean; error?: string } {
  const currentHours = getWorkerHoursOnDate(allocs, workerId, date);
  const totalHours = currentHours + newSlotHours;

  if (totalHours > 16) {
    return {
      valid: false,
      error: `BLOKOVANO: Pracovnik by mel ${totalHours}h za den (limit 16h)`,
    };
  }

  return { valid: true };
}

export function detectConflicts(allocs: Allocation[]): Conflict[] {
  const conflicts: Conflict[] = [];
  const workerDates = new Map<string, Set<string>>();

  // Collect unique worker-date pairs
  for (const a of allocs) {
    const key = a.workerId;
    if (!workerDates.has(key)) workerDates.set(key, new Set());
    workerDates.get(key)!.add(a.date);
  }

  for (const [workerId, dates] of workerDates) {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) continue;

    for (const date of dates) {
      // Check overcapacity
      const hours = getWorkerHoursOnDate(allocs, workerId, date);
      if (hours > 16) {
        conflicts.push({
          type: 'overcapacity',
          workerId,
          date,
          details: `${worker.name}: ${hours}h / 16h limit`,
          totalHours: hours,
        });
      }

      // Check zone conflicts
      const zoneIds = getWorkerZonesOnDate(allocs, workerId, date);
      if (zoneIds.length > 1) {
        const zoneNames = zoneIds
          .map((zid) => zones.find((z) => z.id === zid)?.name)
          .filter(Boolean);
        conflicts.push({
          type: 'zone',
          workerId,
          date,
          details: `${worker.name}: Prirazen do ${zoneNames.join(', ')}`,
          zones: zoneIds,
        });
      }
    }
  }

  return conflicts;
}

export function getDateRange(startDate: Date, days: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    result.push(d.toISOString().split('T')[0]);
  }
  return result;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('cs-CZ', { weekday: 'short', day: 'numeric', month: 'numeric' });
}

export function getDayName(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('cs-CZ', { weekday: 'long' });
}
