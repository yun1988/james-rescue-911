export type DisturberCode = string;

export interface Disturber {
  id: string;
  code: DisturberCode;
  display_name: string;
  color: string;
  description: string | null;
  is_active: boolean;
}

export type RequestType = 'Emergency' | 'Normal' | 'Low';

export type EventSource = 'web' | 'webhook' | 'mqtt';

export interface DisturbanceEvent {
  id: string;
  timestamp: string;
  disturber_id: string | null;
  disturber_name: string;
  request_type: RequestType;
  description: string | null;
  source: EventSource;
  level: string;
  conversation?: string | null;
}

export interface DisturbancePayload {
  who: DisturberCode;
  level?: RequestType;
  message?: string;
}

export interface ChampionEntry {
  disturber_name: string;
  count: number;
  rank: number;
}

export interface TimeSlotData {
  dayOfWeek: number;
  hour: number;
  label: string;
  count: number;
  disturber_name: string;
}

export type PeriodType = 'week' | 'month' | 'quarter';
