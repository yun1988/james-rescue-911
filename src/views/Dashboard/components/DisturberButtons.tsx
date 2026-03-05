import { useDisturberInteraction } from '../../../hooks/useDisturberInteraction';
import type { DisturberName } from '../../../types/disturber.types';

const BUTTONS: { who: DisturberName; label: string; color: string }[] = [
  { who: 'B', label: 'B', color: 'bg-amber-500 hover:bg-amber-600' },
  { who: 'Todd', label: 'Todd', color: 'bg-rose-500 hover:bg-rose-600' },
  { who: 'CJ', label: 'CJ', color: 'bg-violet-500 hover:bg-violet-600' },
];

export function DisturberButtons() {
  const { reportByDisturber, isLoading } = useDisturberInteraction();

  return (
    <div className="flex flex-wrap gap-4">
      <h3 className="w-full text-lg font-semibold text-slate-700 dark:text-slate-200">
        騷擾大軍
      </h3>
      {BUTTONS.map(({ who, label, color }) => (
        <button
          key={who}
          type="button"
          disabled={isLoading}
          onClick={() => reportByDisturber(who, 'Emergency')}
          className={`rounded-lg px-6 py-3 font-bold text-white shadow-lg transition ${color} disabled:opacity-50`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
