import { useRealtimeUpdates } from '../../../hooks/useRealtimeUpdates';

const CARDS = [
  { key: 'today' as const, label: '今日', color: 'bg-emerald-500' },
  { key: 'week' as const, label: '本週', color: 'bg-blue-500' },
  { key: 'month' as const, label: '本月', color: 'bg-indigo-500' },
] as const;

export function CounterCards() {
  const { todayCount, weekCount, monthCount } = useRealtimeUpdates();

  const values = { today: todayCount, week: weekCount, month: monthCount };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {CARDS.map(({ key, label, color }) => (
        <div
          key={key}
          className={`rounded-xl ${color} p-6 text-white shadow-lg`}
        >
          <p className="text-sm font-medium opacity-90">{label}</p>
          <p className="mt-2 text-3xl font-bold">{values[key]}</p>
        </div>
      ))}
    </div>
  );
}
