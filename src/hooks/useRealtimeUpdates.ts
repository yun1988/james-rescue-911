import { useEffect, useState, useCallback } from 'react';
import * as disturberService from '../services/supabase/disturberService';
import type { DisturbanceEvent } from '../types/disturber.types';

function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getStartOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function useRealtimeUpdates() {
  const [todayCount, setTodayCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [monthCount, setMonthCount] = useState(0);
  const [recentEvents, setRecentEvents] = useState<DisturbanceEvent[]>([]);

  const refreshCounts = useCallback(async () => {
    const now = new Date();
    const [today, week, month] = await Promise.all([
      disturberService.getCountSince(getStartOfDay(now)),
      disturberService.getCountSince(getStartOfWeek(now)),
      disturberService.getCountSince(getStartOfMonth(now)),
    ]);
    setTodayCount(today);
    setWeekCount(week);
    setMonthCount(month);
  }, []);

  const refreshRecent = useCallback(async () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    const events = await disturberService.getEventsSince(start, end);
    setRecentEvents(events.slice(-20).reverse());
  }, []);

  useEffect(() => {
    refreshCounts();
    refreshRecent();
  }, [refreshCounts, refreshRecent]);

  useEffect(() => {
    const channel = disturberService.subscribeToInserts(() => {
      refreshCounts();
      refreshRecent();
    });

    return () => {
      channel.unsubscribe();
    };
  }, [refreshCounts, refreshRecent]);

  return {
    todayCount,
    weekCount,
    monthCount,
    recentEvents,
    refreshCounts,
    refreshRecent,
  };
}
