import { useEffect, useState } from 'react';
import { useDisturberInteraction } from '../../../hooks/useDisturberInteraction';
import type { Disturber } from '../../../types/disturber.types';
import { getActiveDisturbers } from '../../../services/supabase/disturberService';

export function DisturberButtons() {
  const { reportByDisturber, isLoading } = useDisturberInteraction();
  const [message, setMessage] = useState('');
  const [disturbers, setDisturbers] = useState<Disturber[]>([]);

  useEffect(() => {
    getActiveDisturbers().then(setDisturbers);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <h3 className="w-full text-lg font-semibold text-slate-700 dark:text-slate-200">
          騷擾大軍
        </h3>
        {disturbers.map((d) => (
          <button
            key={d.id}
            type="button"
            disabled={isLoading}
            onClick={async () => {
              await reportByDisturber(d.code, 'Emergency', message || undefined);
              setMessage('');
            }}
            className={`rounded-lg px-6 py-3 font-bold text-white shadow-lg transition disabled:opacity-50`}
            style={{ backgroundColor: d.color }}
          >
            {d.display_name}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          要一起記錄的對話（可選）
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder={
            [
              'Todd: 我明天要交誒，再幫我想一下',
              'Todd: 我不知道 我不知道 我不知道',
              'Todd: 我不知道 你幫我想 （跑掉',
              'Todd: 幫我想一下 交給你了 （跑掉',
              'B: 這個前端很簡單啦 一兩天就做完了',
              'B: 你不覺得 casdoor 有遠大的夢想嗎',
              'B: 用網路的套件 不會有資安問題',
              'B: 這個需求我們忘記做了 你可以幫我們做一下嗎 下禮拜要交',
            ].join('\n')
          }
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          留空就只記錄時間和人物；有填就會一起存進資料庫。
        </p>
      </div>
    </div>
  );
}
