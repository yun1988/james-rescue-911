import { useEffect, useState, useCallback } from 'react';
import {
  getChampions,
  getTimeDistribution,
} from '../controllers/analyticsController';
import type { ChampionEntry, TimeSlotData } from '../types/disturber.types';

export function useTimeAnalysis() {
  const [weekChampions, setWeekChampions] = useState<ChampionEntry[]>([]);
  const [monthChampions, setMonthChampions] = useState<ChampionEntry[]>([]);
  const [quarterChampions, setQuarterChampions] = useState<ChampionEntry[]>([]);
  const [timeDistribution, setTimeDistribution] = useState<TimeSlotData[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [week, month, quarter, distribution] = await Promise.all([
        getChampions('week'),
        getChampions('month'),
        getChampions('quarter'),
        getTimeDistribution(),
      ]);
      setWeekChampions(week);
      setMonthChampions(month);
      setQuarterChampions(quarter);
      setTimeDistribution(distribution);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    weekChampions,
    monthChampions,
    quarterChampions,
    timeDistribution,
    loading,
    refresh,
  };
}
