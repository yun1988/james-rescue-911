import type { PeriodType } from '../types/disturber.types';

const DAY_NAMES = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

export function formatTimeSlot(dayOfWeek: number, hour: number): string {
  return `${DAY_NAMES[dayOfWeek]} ${hour}:00`;
}

export function getPeriodBounds(period: PeriodType): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case 'week':
      start.setDate(end.getDate() - 7);
      break;
    case 'month':
      start.setMonth(end.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(end.getMonth() - 3);
      break;
  }

  return { start, end };
}

export function toISODateString(date: Date): string {
  return date.toISOString();
}
