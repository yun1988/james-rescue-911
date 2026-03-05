import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTimeAnalysis } from '../../../hooks/useTimeAnalysis';
import { getActiveDisturbers } from '../../../services/supabase/disturberService';
import type { Disturber } from '../../../types/disturber.types';

function buildChartData(rows: { label: string; count: number; disturber_name: string }[]) {
  const byDate = new Map<string, Record<string, number | string>>();

  for (const r of rows) {
    const key = r.label; // YYYY-MM-DD
    if (!byDate.has(key)) {
      byDate.set(key, { label: key });
    }
    const row = byDate.get(key)!;
    row[r.disturber_name] = (row[r.disturber_name] as number | undefined ?? 0) + r.count;
  }

  return Array.from(byDate.values()).sort((a, b) =>
    String(a.label).localeCompare(String(b.label))
  );
}

export function TimeDistributionChart() {
  const { timeDistribution, loading } = useTimeAnalysis();
  const [disturbers, setDisturbers] = useState<Disturber[]>([]);

  useEffect(() => {
    getActiveDisturbers().then(setDisturbers);
  }, []);

  const chartData = buildChartData(timeDistribution);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
        <h3 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
          出沒時間分佈
        </h3>
        <p className="text-slate-500">載入中...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
      <h3 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
        出沒時間分佈
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis
              dataKey="label"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: '#e5e7eb', fontSize: 12 }} // text-slate-200
            />
            <YAxis tick={{ fill: '#e5e7eb', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tw-bg-opacity, 1)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            />
            <Legend
              wrapperStyle={{
                color: '#e5e7eb',
              }}
            />
            {disturbers.map((d: Disturber) => (
              <Line
                key={d.id}
                type="monotone"
                dataKey={d.display_name}
                stroke={d.color}
                name={d.display_name}
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
