import * as disturberService from '../services/supabase/disturberService';
import { getPeriodBounds } from '../lib/utils';
import type {
  ChampionEntry,
  TimeSlotData,
  PeriodType,
  DisturberName,
} from '../types/disturber.types';

const DISTURBERS: DisturberName[] = ['B', 'Todd', 'CJ'];

export async function getChampions(period: PeriodType): Promise<ChampionEntry[]> {
  const { start, end } = getPeriodBounds(period);
  const events = await disturberService.getEventsSince(start, end);

  const counts = new Map<DisturberName, number>();
  for (const d of DISTURBERS) {
    counts.set(d, 0);
  }
  for (const e of events) {
    const name = e.disturber_name as DisturberName;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  const entries: ChampionEntry[] = DISTURBERS.map((name) => ({
    disturber_name: name,
    count: counts.get(name) ?? 0,
    rank: 0,
  }));

  entries.sort((a, b) => b.count - a.count);
  entries.forEach((e, i) => {
    e.rank = i + 1;
  });

  return entries;
}

export async function getTimeDistribution(): Promise<TimeSlotData[]> {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);

  const events = await disturberService.getEventsSince(start, end);

  // Map key: `${disturber_name}-${hour}`, aggregated across all days
  const slotMap = new Map<string, { count: number; disturber_name: DisturberName; hour: number }>();

  for (const e of events) {
    const d = new Date(e.timestamp);
    const hour = d.getHours();
    const key = `${e.disturber_name}-${hour}`;

    const existing = slotMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      slotMap.set(key, {
        count: 1,
        disturber_name: e.disturber_name as DisturberName,
        hour,
      });
    }
  }

  const result: TimeSlotData[] = [];
  slotMap.forEach((v) => {
    result.push({
      dayOfWeek: 0,
      hour: v.hour,
      label: `${v.hour.toString().padStart(2, '0')}:00`,
      count: v.count,
      disturber_name: v.disturber_name,
    });
  });

  // Sort by hour ascending so X 軸從 00:00 → 23:00
  result.sort((a, b) => a.hour - b.hour);
  return result;
}
