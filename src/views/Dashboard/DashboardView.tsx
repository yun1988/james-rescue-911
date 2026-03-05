import { DisturberButtons } from './components/DisturberButtons';
import { CounterCards } from './components/CounterCards';
import { ChampionRanking } from './components/ChampionRanking';
import { TimeDistributionChart } from './components/TimeDistributionChart';
import { EventLog } from './components/EventLog';

export function DashboardView() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          James Rescue 911
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          騷擾事件監控儀表板
        </p>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 p-6">
        <section>
          <DisturberButtons />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
            總計數器
          </h2>
          <CounterCards />
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div>
            <ChampionRanking />
          </div>
          <div>
            <EventLog />
          </div>
        </section>

        <section>
          <TimeDistributionChart />
        </section>
      </main>
    </div>
  );
}
