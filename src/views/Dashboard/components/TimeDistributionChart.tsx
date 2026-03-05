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

function formatChartData(rows: { label: string; count: number }[]) {
  return [...rows].sort((a, b) => a.label.localeCompare(b.label));
}

export function TimeDistributionChart() {
  const { timeDistribution, loading } = useTimeAnalysis();

  const aggregated = Object.values(
    timeDistribution.reduce<Record<string, { label: string; count: number }>>((acc, row) => {
      const key = row.label;
      if (!acc[key]) {
        acc[key] = { label: key, count: 0 };
      }
      acc[key].count += row.count;
      return acc;
    }, {})
  );

  const chartData = formatChartData(aggregated);

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
            <Line type="monotone" dataKey="count" stroke="#fb7185" name="次數" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
