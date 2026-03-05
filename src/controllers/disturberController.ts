import * as disturberService from '../services/supabase/disturberService';
import type { DisturbanceEvent, DisturbancePayload, EventSource } from '../types/disturber.types';

export async function reportDisturbance(
  payload: DisturbancePayload,
  source: EventSource = 'web'
): Promise<DisturbanceEvent | null> {
  const { who, level = 'Emergency', message } = payload;

  return disturberService.insertDisturbance({
    disturber_code: who,
    request_type: level,
    description: null,
    source,
    level,
    conversation: message ?? null,
  });
}
