import { supabase } from './client';
import type { DisturbanceEvent, Disturber, DisturberCode, EventSource } from '../../types/disturber.types';

const EVENTS_TABLE = 'disturbance_events';
const DISTURBERS_TABLE = 'disturbers';

export interface InsertDisturbanceInput {
  disturber_code: DisturberCode;
  request_type: string;
  description?: string | null;
  source: EventSource;
  level: string;
  conversation?: string | null;
}

export async function insertDisturbance(input: InsertDisturbanceInput): Promise<DisturbanceEvent | null> {
  // 先依 code 找對應的 disturber（允許 null，方便之後擴充）
  const { data: disturber } = await supabase
    .from(DISTURBERS_TABLE)
    .select('*')
    .eq('code', input.disturber_code)
    .maybeSingle();

  const { data, error } = await supabase
    .from(EVENTS_TABLE)
    .insert({
      disturber_id: disturber?.id ?? null,
      disturber_name: disturber?.display_name ?? input.disturber_code,
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
    .from(EVENTS_TABLE)
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
    .from(EVENTS_TABLE)
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
      { event: 'INSERT', schema: 'public', table: EVENTS_TABLE },
      (payload) => {
        callback({ new: payload.new as DisturbanceEvent });
      }
    )
    .subscribe();
}

export async function getActiveDisturbers(): Promise<Disturber[]> {
  const { data, error } = await supabase
    .from(DISTURBERS_TABLE)
    .select('*')
    .eq('is_active', true)
    .order('code', { ascending: true });

  if (error) {
    console.error('disturberService.getActiveDisturbers error:', error);
    return [];
  }

  return (data ?? []) as Disturber[];
}
