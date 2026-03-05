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
import type { TimeSlotData } from '../../../types/disturber.types';

const DISTURBER_COLORS: Record<string, string> = {
  B: '#f59e0b',
  Todd: '#f43f5e',
  CJ: '#8b5cf6',
};

interface ChartRow {
  slot: string;
  B?: number;
  Todd?: number;
  CJ?: number;
}

function formatChartData(rows: TimeSlotData[]): ChartRow[] {
  const bySlot = new Map<string, ChartRow>();

  for (const r of rows) {
    const key = r.label;
    if (!bySlot.has(key)) {
      bySlot.set(key, { slot: key });
    }
    const row = bySlot.get(key)!;
    row[r.disturber_name] = r.count;
  }

  return Array.from(bySlot.values()).sort((a, b) => a.slot.localeCompare(b.slot));
}

export function TimeDistributionChart() {
  const { timeDistribution, loading } = useTimeAnalysis();

  const chartData = formatChartData(timeDistribution);

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
              dataKey="slot"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: 'currentColor', fontSize: 12 }}
            />
            <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tw-bg-opacity, 1)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="B"
              stroke={DISTURBER_COLORS.B}
              name="B"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="Todd"
              stroke={DISTURBER_COLORS.Todd}
              name="Todd"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="CJ"
              stroke={DISTURBER_COLORS.CJ}
              name="CJ"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
