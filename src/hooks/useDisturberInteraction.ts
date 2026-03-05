import { useCallback, useState } from 'react';
import { reportDisturbance as reportDisturbanceController } from '../controllers/disturberController';
import type { DisturbancePayload, DisturberCode } from '../types/disturber.types';

export function useDisturberInteraction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reportDisturbance = useCallback(async (payload: DisturbancePayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await reportDisturbanceController(payload, 'web');
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to report disturbance';
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reportByDisturber = useCallback(
    (
      who: DisturberCode,
      level: 'Emergency' | 'Normal' | 'Low' = 'Emergency',
      message?: string
    ) => {
      return reportDisturbance({ who, level, message });
    },
    [reportDisturbance]
  );

  return { reportDisturbance, reportByDisturber, isLoading, error };
}
