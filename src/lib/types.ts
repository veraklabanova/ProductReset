export type TimeSlot = 'AM' | 'PM' | 'DAY' | 'NIGHT';

export const SLOT_HOURS: Record<TimeSlot, number> = {
  AM: 4,
  PM: 4,
  DAY: 8,
  NIGHT: 8,
};

export const SLOT_LABELS: Record<TimeSlot, string> = {
  AM: 'AM (4h)',
  PM: 'PM (4h)',
  DAY: 'Den (8h)',
  NIGHT: 'Noc (8h)',
};

export type IndustryTemplate = 'ground_construction' | 'transportation' | 'specialized_trades';

export const TEMPLATE_LABELS: Record<IndustryTemplate, string> = {
  ground_construction: 'Pozemni stavby',
  transportation: 'Dopravni stavby',
  specialized_trades: 'Specializovane remesla',
};

export interface Worker {
  id: string;
  name: string;
  specialization: string;
  zone: string;
  active: boolean;
  phone?: string;
  template: IndustryTemplate;
}

export interface Project {
  id: string;
  name: string;
  zone: string;
  client: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'planned' | 'completed';
  template: IndustryTemplate;
}

export interface Zone {
  id: string;
  name: string;
  region: string;
  color: string;
}

export interface Allocation {
  id: string;
  workerId: string;
  projectId: string;
  date: string; // YYYY-MM-DD
  slot: TimeSlot;
  override?: boolean;
  overrideReason?: string;
}

export interface Conflict {
  type: 'overcapacity' | 'zone';
  workerId: string;
  date: string;
  details: string;
  totalHours?: number;
  zones?: string[];
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  workerId?: string;
  projectId?: string;
}

export interface MigrationFieldMapping {
  v1Field: string;
  v2Field: string;
  status: 'mapped' | 'conflict' | 'unmapped';
  conflictReason?: string;
}
