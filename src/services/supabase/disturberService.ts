import { supabase } from './client';
import type { DisturbanceEvent, DisturberName, EventSource } from '../../types/disturber.types';

const TABLE = 'disturbance_events';

export interface InsertDisturbanceInput {
  disturber_name: DisturberName;
  request_type: string;
  description?: string | null;
  source: EventSource;
  level: string;
  conversation?: string | null;
}

export async function insertDisturbance(input: InsertDisturbanceInput): Promise<DisturbanceEvent | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      disturber_name: input.disturber_name,
      request_type: input.request_type,
      description: input.description ?? null,
      source: input.source,
      level: input.level,
      conversation: input.conversation ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error('disturberService.insertDisturbance error:', error);
    return null;
  }

  return data as DisturbanceEvent;
}

export async function getEventsSince(startDate: Date, endDate: Date): Promise<DisturbanceEvent[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('disturberService.getEventsSince error:', error);
    return [];
  }

  return (data ?? []) as DisturbanceEvent[];
}

export async function getCountSince(date: Date): Promise<number> {
  const { count, error } = await supabase
    .from(TABLE)
    .select('*', { count: 'exact', head: true })
    .gte('timestamp', date.toISOString());

  if (error) {
    console.error('disturberService.getCountSince error:', error);
    return 0;
  }

  return count ?? 0;
}

export function subscribeToInserts(callback: (payload: { new: DisturbanceEvent }) => void) {
  return supabase
    .channel('disturbance_events_inserts')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: TABLE },
      (payload) => {
        callback({ new: payload.new as DisturbanceEvent });
      }
    )
    .subscribe();
}
