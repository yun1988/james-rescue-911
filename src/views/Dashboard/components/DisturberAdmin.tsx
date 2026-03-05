import { useEffect, useState } from 'react';
import type { Disturber } from '../../../types/disturber.types';
import { getActiveDisturbers } from '../../../services/supabase/disturberService';
import { supabase } from '../../../services/supabase/client';

interface FormState {
  code: string;
  display_name: string;
  color: string;
  description: string;
}

export function DisturberAdmin() {
  const [disturbers, setDisturbers] = useState<Disturber[]>([]);
  const [form, setForm] = useState<FormState>({
    code: '',
    display_name: '',
    color: '#f97316',
    description: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    const list = await getActiveDisturbers();
    setDisturbers(list);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.display_name) {
      setError('代號與顯示名稱必填');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from('disturbers').insert({
        code: form.code,
        display_name: form.display_name,
        color: form.color,
        description: form.description || null,
        is_active: true,
      });
      if (insertError) {
        setError(insertError.message);
      } else {
        setForm({ code: '', display_name: '', color: '#f97316', description: '' });
        await refresh();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '新增成員失敗';
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
      <h3 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
        騷擾成員管理
      </h3>

      <form onSubmit={handleSubmit} className="mb-4 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              代號（code）
            </label>
            <input
              value={form.code}
              onChange={(e) => handleChange('code', e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
              placeholder="例如：Todd"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              顯示名稱
            </label>
            <input
              value={form.display_name}
              onChange={(e) => handleChange('display_name', e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
              placeholder="例如：Todd"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              顏色
            </label>
            <input
              type="color"
              value={form.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="mt-1 h-8 w-12 cursor-pointer rounded border border-slate-300 dark:border-slate-700"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
            說明（可選）
          </label>
          <input
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
            placeholder="例如：常在下午兩點出沒，會問設計問題"
          />
        </div>
        {error && <p className="text-xs text-rose-500">{error}</p>}
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow disabled:opacity-50"
        >
          {isSaving ? '儲存中...' : '新增成員'}
        </button>
      </form>

      <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
        {disturbers.map((d) => (
          <div key={d.id} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="font-semibold">{d.display_name}</span>
            <span className="text-[11px] text-slate-500">({d.code})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

