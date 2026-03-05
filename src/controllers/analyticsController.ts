import * as disturberService from '../services/supabase/disturberService';
import { getPeriodBounds } from '../lib/utils';
import type { ChampionEntry, TimeSlotData, PeriodType, DisturberCode } from '../types/disturber.types';

export async function getChampions(period: PeriodType): Promise<ChampionEntry[]> {
  const { start, end } = getPeriodBounds(period);
  const events = await disturberService.getEventsSince(start, end);
  const disturbers = await disturberService.getActiveDisturbers();

  const counts = new Map<DisturberCode, number>();
  for (const d of disturbers) {
    counts.set(d.code, 0);
  }
  for (const e of events) {
    const code = e.disturber_name as DisturberCode;
    counts.set(code, (counts.get(code) ?? 0) + 1);
  }

  const entries: ChampionEntry[] = disturbers.map((d) => ({
    disturber_name: d.display_name,
    count: counts.get(d.code) ?? 0,
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

  // Map key: `${disturber_name}-${date}`, aggregated by day
  const slotMap = new Map<string, { count: number; disturber_name: string; date: string }>();

  for (const e of events) {
    const d = new Date(e.timestamp);
    const dateKey = d.toISOString().slice(0, 10); // YYYY-MM-DD
    const key = `${e.disturber_name}-${dateKey}`;

    const existing = slotMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      slotMap.set(key, {
        count: 1,
        disturber_name: e.disturber_name,
        date: dateKey,
      });
    }
  }

  const result: TimeSlotData[] = [];
  slotMap.forEach((v) => {
    result.push({
      dayOfWeek: 0,
      hour: 0,
      label: v.date,
      count: v.count,
      disturber_name: v.disturber_name,
    });
  });

  // Sort by date ascending
  result.sort((a, b) => a.label.localeCompare(b.label));
  return result;
}
