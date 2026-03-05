import { useRealtimeUpdates } from '../../../hooks/useRealtimeUpdates';

function formatTimestamp(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function EventLog() {
  const { recentEvents } = useRealtimeUpdates();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
      <h3 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
        事件紀錄
      </h3>

      {recentEvents.length === 0 ? (
        <p className="text-sm text-slate-500">最近 7 天還沒有任何騷擾事件。</p>
      ) : (
        <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {recentEvents.map((event) => (
            <li
              key={event.id}
              className="rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">
                  alert
                </span>
                <span className="flex-1 truncate text-slate-700 dark:text-slate-200">
                  {formatTimestamp(event.timestamp)}
                </span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {event.disturber_name}
                </span>
              </div>
              {event.conversation && (
                <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                  {event.conversation}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

