export type DisturberName = 'B' | 'Todd' | 'CJ';

export type RequestType = 'Emergency' | 'Normal' | 'Low';

export type EventSource = 'web' | 'webhook' | 'mqtt';

export interface DisturbanceEvent {
  id: string;
  timestamp: string;
  disturber_name: DisturberName;
  request_type: RequestType;
  description: string | null;
  source: EventSource;
  level: string;
}

export interface DisturbancePayload {
  who: DisturberName;
  level?: RequestType;
}

export interface ChampionEntry {
  disturber_name: DisturberName;
  count: number;
  rank: number;
}

export interface TimeSlotData {
  dayOfWeek: number;
  hour: number;
  label: string;
  count: number;
  disturber_name: DisturberName;
}

export type PeriodType = 'week' | 'month' | 'quarter';
