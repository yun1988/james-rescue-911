import { useTimeAnalysis } from '../../../hooks/useTimeAnalysis';
import type { ChampionEntry } from '../../../types/disturber.types';

const PERIODS = [
  { key: 'week' as const, label: '週冠軍' },
  { key: 'month' as const, label: '月冠軍' },
  { key: 'quarter' as const, label: '季冠軍' },
] as const;

const RANK_EMOJI = ['🥇', '🥈', '🥉'];

function RankRow({ entry }: { entry: ChampionEntry }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-100 px-4 py-2 dark:bg-slate-800">
      <span className="text-lg">{RANK_EMOJI[entry.rank - 1] ?? entry.rank}</span>
      <span className="font-semibold">{entry.disturber_name}</span>
      <span className="text-slate-600 dark:text-slate-400">{entry.count} 次</span>
    </div>
  );
}

export function ChampionRanking() {
  const {
    weekChampions,
    monthChampions,
    quarterChampions,
    loading,
  } = useTimeAnalysis();

  const data = {
    week: weekChampions,
    month: monthChampions,
    quarter: quarterChampions,
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
        <h3 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
          冠軍排行榜
        </h3>
        <p className="text-slate-500">載入中...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
      <h3 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
        冠軍排行榜
      </h3>
      <div className="grid gap-6 sm:grid-cols-3">
        {PERIODS.map(({ key, label }) => (
          <div key={key}>
            <h4 className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              {label}
            </h4>
            <div className="space-y-2">
              {data[key].map((entry) => (
                <RankRow key={entry.disturber_name} entry={entry} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
