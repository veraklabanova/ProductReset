import { Worker, Project, Zone, Allocation, AuditEntry, MigrationFieldMapping } from './types';

export const zones: Zone[] = [
  { id: 'z1', name: 'Praha-zapad', region: 'Stredocesky kraj', color: '#3b82f6' },
  { id: 'z2', name: 'Brno-mesto', region: 'Jihomoravsky kraj', color: '#10b981' },
  { id: 'z3', name: 'Ostrava', region: 'Moravskoslezsky kraj', color: '#f59e0b' },
];

export const workers: Worker[] = [
  { id: 'w1', name: 'Jan Novak', specialization: 'Tesariny', zone: 'z1', active: true, phone: '+420 601 111 001', template: 'ground_construction' },
  { id: 'w2', name: 'Petr Svoboda', specialization: 'Zednictvi', zone: 'z1', active: true, phone: '+420 601 111 002', template: 'ground_construction' },
  { id: 'w3', name: 'Martin Dvorak', specialization: 'Elektroinstalace', zone: 'z1', active: true, phone: '+420 601 111 003', template: 'specialized_trades' },
  { id: 'w4', name: 'Tomas Cerny', specialization: 'Instalaterske prace', zone: 'z2', active: true, phone: '+420 601 111 004', template: 'specialized_trades' },
  { id: 'w5', name: 'Lukas Vesely', specialization: 'Ridic', zone: 'z2', active: true, phone: '+420 601 111 005', template: 'transportation' },
  { id: 'w6', name: 'Jakub Horak', specialization: 'Tesariny', zone: 'z2', active: true, phone: '+420 601 111 006', template: 'ground_construction' },
  { id: 'w7', name: 'David Marek', specialization: 'Zednictvi', zone: 'z3', active: true, phone: '+420 601 111 007', template: 'ground_construction' },
  { id: 'w8', name: 'Filip Pospisil', specialization: 'Jerabnik', zone: 'z3', active: true, phone: '+420 601 111 008', template: 'transportation' },
  { id: 'w9', name: 'Adam Hajek', specialization: 'Ridic', zone: 'z1', active: true, phone: '+420 601 111 009', template: 'transportation' },
  { id: 'w10', name: 'Ondrej Kral', specialization: 'Elektroinstalace', zone: 'z2', active: true, phone: '+420 601 111 010', template: 'specialized_trades' },
  { id: 'w11', name: 'Vojtech Ruzicka', specialization: 'Tesariny', zone: 'z3', active: true, phone: '+420 601 111 011', template: 'ground_construction' },
  { id: 'w12', name: 'Matej Fiala', specialization: 'Zednictvi', zone: 'z1', active: true, phone: '+420 601 111 012', template: 'ground_construction' },
  { id: 'w13', name: 'Radek Stastny', specialization: 'Svarec', zone: 'z3', active: false, phone: '+420 601 111 013', template: 'specialized_trades' },
  { id: 'w14', name: 'Karel Krejci', specialization: 'Ridic', zone: 'z2', active: true, phone: '+420 601 111 014', template: 'transportation' },
  { id: 'w15', name: 'Miroslav Jelinek', specialization: 'Instalaterske prace', zone: 'z1', active: true, phone: '+420 601 111 015', template: 'specialized_trades' },
];

export const projects: Project[] = [
  { id: 'p1', name: 'Rezidence Vinohrady', zone: 'z1', client: 'Skanska CZ', startDate: '2026-03-01', endDate: '2026-06-30', status: 'active', template: 'ground_construction' },
  { id: 'p2', name: 'Obchvat D1 Brno', zone: 'z2', client: 'Eurovia CS', startDate: '2026-02-15', endDate: '2026-09-30', status: 'active', template: 'transportation' },
  { id: 'p3', name: 'Rekonstrukce nemocnice', zone: 'z2', client: 'Metrostav', startDate: '2026-03-10', endDate: '2026-08-15', status: 'active', template: 'specialized_trades' },
  { id: 'p4', name: 'Logisticky park Ostrava', zone: 'z3', client: 'Strabag', startDate: '2026-04-01', endDate: '2026-12-31', status: 'planned', template: 'ground_construction' },
  { id: 'p5', name: 'Most pres Vltavu', zone: 'z1', client: 'SMP CZ', startDate: '2026-01-15', endDate: '2026-07-30', status: 'active', template: 'transportation' },
];

// Generate 2 weeks of allocations with intentional conflicts
function generateAllocations(): Allocation[] {
  const allocs: Allocation[] = [];
  let id = 1;

  const baseDate = new Date('2026-03-23'); // Monday

  for (let day = 0; day < 14; day++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + day);
    if (date.getDay() === 0 || date.getDay() === 6) continue; // skip weekends
    const dateStr = date.toISOString().split('T')[0];

    // Normal allocations
    allocs.push({ id: `a${id++}`, workerId: 'w1', projectId: 'p1', date: dateStr, slot: 'DAY' });
    allocs.push({ id: `a${id++}`, workerId: 'w2', projectId: 'p1', date: dateStr, slot: 'AM' });
    allocs.push({ id: `a${id++}`, workerId: 'w2', projectId: 'p5', date: dateStr, slot: 'PM' });
    allocs.push({ id: `a${id++}`, workerId: 'w5', projectId: 'p2', date: dateStr, slot: 'DAY' });
    allocs.push({ id: `a${id++}`, workerId: 'w6', projectId: 'p3', date: dateStr, slot: 'AM' });
    allocs.push({ id: `a${id++}`, workerId: 'w7', projectId: 'p4', date: dateStr, slot: 'DAY' });
    allocs.push({ id: `a${id++}`, workerId: 'w8', projectId: 'p4', date: dateStr, slot: 'AM' });
    allocs.push({ id: `a${id++}`, workerId: 'w10', projectId: 'p3', date: dateStr, slot: 'DAY' });
    allocs.push({ id: `a${id++}`, workerId: 'w11', projectId: 'p4', date: dateStr, slot: 'DAY' });
    allocs.push({ id: `a${id++}`, workerId: 'w12', projectId: 'p1', date: dateStr, slot: 'AM' });
    allocs.push({ id: `a${id++}`, workerId: 'w14', projectId: 'p2', date: dateStr, slot: 'DAY' });
    allocs.push({ id: `a${id++}`, workerId: 'w15', projectId: 'p5', date: dateStr, slot: 'PM' });
  }

  // INTENTIONAL CONFLICTS:
  // Worker w3: 16h+ on Monday (DAY=8h + NIGHT=8h + AM=4h = 20h)
  allocs.push({ id: `a${id++}`, workerId: 'w3', projectId: 'p1', date: '2026-03-23', slot: 'DAY' });
  allocs.push({ id: `a${id++}`, workerId: 'w3', projectId: 'p5', date: '2026-03-23', slot: 'NIGHT' });
  allocs.push({ id: `a${id++}`, workerId: 'w3', projectId: 'p1', date: '2026-03-23', slot: 'AM' });

  // Worker w4: zone conflict on Tuesday (p2=z2, p1=z1 same day)
  allocs.push({ id: `a${id++}`, workerId: 'w4', projectId: 'p2', date: '2026-03-24', slot: 'AM' });
  allocs.push({ id: `a${id++}`, workerId: 'w4', projectId: 'p1', date: '2026-03-24', slot: 'PM' });

  // Worker w9: zone conflict (p1=z1, p2=z2 same day)
  allocs.push({ id: `a${id++}`, workerId: 'w9', projectId: 'p1', date: '2026-03-25', slot: 'AM' });
  allocs.push({ id: `a${id++}`, workerId: 'w9', projectId: 'p2', date: '2026-03-25', slot: 'PM' });

  // Worker w6: 16h+ on Wednesday (AM=4 + PM=4 + NIGHT=8 = 16, but add DAY too = 24h)
  allocs.push({ id: `a${id++}`, workerId: 'w6', projectId: 'p3', date: '2026-03-25', slot: 'PM' });
  allocs.push({ id: `a${id++}`, workerId: 'w6', projectId: 'p2', date: '2026-03-25', slot: 'NIGHT' });

  // Override example
  allocs.push({
    id: `a${id++}`,
    workerId: 'w4',
    projectId: 'p3',
    date: '2026-03-26',
    slot: 'AM',
    override: true,
    overrideReason: 'Klient vyzaduje dokonceni pred kontrolou - schvaleno vedoucim',
  });
  allocs.push({ id: `a${id++}`, workerId: 'w4', projectId: 'p1', date: '2026-03-26', slot: 'PM' });

  return allocs;
}

export const allocations: Allocation[] = generateAllocations();

export const auditLog: AuditEntry[] = [
  { id: 'au1', timestamp: '2026-03-23T08:15:00', action: 'allocation_created', user: 'Dispatcher Kovar', details: 'Prirazeni Jan Novak na Rezidence Vinohrady (Den)', workerId: 'w1', projectId: 'p1' },
  { id: 'au2', timestamp: '2026-03-23T08:20:00', action: 'allocation_created', user: 'Dispatcher Kovar', details: 'Prirazeni Martin Dvorak na Rezidence Vinohrady (Den)', workerId: 'w3', projectId: 'p1' },
  { id: 'au3', timestamp: '2026-03-23T09:00:00', action: 'overcapacity_blocked', user: 'System', details: 'Blokovano: Martin Dvorak presahuje 16h limit (20h) dne 2026-03-23', workerId: 'w3' },
  { id: 'au4', timestamp: '2026-03-24T07:45:00', action: 'zone_warning', user: 'System', details: 'Varovani: Tomas Cerny prirazen do 2 zon (Praha-zapad, Brno-mesto) dne 2026-03-24', workerId: 'w4' },
  { id: 'au5', timestamp: '2026-03-26T08:00:00', action: 'override_applied', user: 'Dispatcher Kovar', details: 'Prepis zonoveho pravidla: Tomas Cerny - Klient vyzaduje dokonceni pred kontrolou', workerId: 'w4', projectId: 'p3' },
  { id: 'au6', timestamp: '2026-03-25T10:30:00', action: 'zone_warning', user: 'System', details: 'Varovani: Adam Hajek prirazen do 2 zon (Praha-zapad, Brno-mesto) dne 2026-03-25', workerId: 'w9' },
  { id: 'au7', timestamp: '2026-03-25T11:00:00', action: 'overcapacity_blocked', user: 'System', details: 'Varovani: Jakub Horak dosahuje 16h limitu dne 2026-03-25', workerId: 'w6' },
  { id: 'au8', timestamp: '2026-03-22T14:00:00', action: 'project_created', user: 'Dispatcher Kovar', details: 'Novy projekt: Logisticky park Ostrava (Strabag)', projectId: 'p4' },
  { id: 'au9', timestamp: '2026-03-20T09:00:00', action: 'worker_deactivated', user: 'Dispatcher Kovar', details: 'Pracovnik deaktivovan: Radek Stastny (ukonceni smlouvy)', workerId: 'w13' },
  { id: 'au10', timestamp: '2026-03-26T15:00:00', action: 'bulk_move', user: 'Dispatcher Kovar', details: 'Hromadny presun: 3 pracovnici z Rezidence Vinohrady na Most pres Vltavu' },
];

export const migrationFieldMappings: MigrationFieldMapping[] = [
  { v1Field: 'zamestnanec_jmeno', v2Field: 'worker.name', status: 'mapped' },
  { v1Field: 'zamestnanec_tel', v2Field: 'worker.phone', status: 'mapped' },
  { v1Field: 'projekt_nazev', v2Field: 'project.name', status: 'mapped' },
  { v1Field: 'projekt_klient', v2Field: 'project.client', status: 'mapped' },
  { v1Field: 'smena_typ', v2Field: 'allocation.slot', status: 'conflict', conflictReason: 'v1.0 pouziva vlastni typy smen (nepodporovano ve v2.0)' },
  { v1Field: 'hodiny_denne', v2Field: 'allocation.weight_hours', status: 'conflict', conflictReason: '3 zaznamy presahuji 16h limit (max 24h)' },
  { v1Field: 'oblast', v2Field: 'zone.name', status: 'mapped' },
  { v1Field: 'specialni_rezim', v2Field: '-', status: 'unmapped', conflictReason: 'Specialni rezimy jsou ve v2.0 zruseny' },
  { v1Field: 'poznamka_vedouci', v2Field: 'audit.details', status: 'mapped' },
  { v1Field: 'datum_prirazeni', v2Field: 'allocation.date', status: 'mapped' },
];
