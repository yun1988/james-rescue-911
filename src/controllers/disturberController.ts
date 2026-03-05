import * as disturberService from '../services/supabase/disturberService';
import type {
  DisturbanceEvent,
  DisturbancePayload,
  DisturberName,
  EventSource,
} from '../types/disturber.types';

const DISTURBER_DESCRIPTIONS: Record<DisturberName, string> = {
  B: 'B 的騷擾需求說明',
  Todd: 'Todd 的騷擾需求說明',
  CJ: 'CJ 的騷擾需求說明',
};

export async function reportDisturbance(
  payload: DisturbancePayload,
  source: EventSource = 'web'
): Promise<DisturbanceEvent | null> {
  const { who, level = 'Emergency' } = payload;

  return disturberService.insertDisturbance({
    disturber_name: who,
    request_type: level,
    description: getDisturberDescription(who),
    source,
    level,
  });
}

export function getDisturberDescription(name: DisturberName): string {
  return DISTURBER_DESCRIPTIONS[name] ?? '';
}
