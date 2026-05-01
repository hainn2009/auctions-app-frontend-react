import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "../components/LoadingScreen.js";
import {
  AnalyticsCategoryReport,
  AnalyticsHotAuction,
  dashboardAnalytics,
  dashboardAnalyticsHealth,
  DashboardAnalyticsHealth,
  DashboardAnalyticsReport,
} from "../api/auction.js";

const healthLabel = (health?: DashboardAnalyticsHealth) => {
  if (!health) return { text: "Loading", className: "bg-gray-100 text-gray-700" };
  if (health.status === "healthy") {
    return { text: "AI service healthy", className: "bg-green-100 text-green-800" };
  }
  return { text: "Using fallback analytics", className: "bg-yellow-100 text-yellow-800" };
};

export const Analytics = () => {
  const reportQuery = useQuery<DashboardAnalyticsReport, Error>({
    queryKey: ["analytics-report"],
    queryFn: dashboardAnalytics,
    staleTime: 30 * 1000,
  });

  const healthQuery = useQuery<DashboardAnalyticsHealth, Error>({
    queryKey: ["analytics-health"],
    queryFn: dashboardAnalyticsHealth,
    staleTime: 30 * 1000,
  });

  if (reportQuery.isLoading) return <LoadingScreen />;

  if (reportQuery.isError || !reportQuery.data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white border border-red-200 text-red-700 rounded-sm p-4">
          Failed to load analytics report.
        </div>
      </div>
    );
  }

  const report = reportQuery.data;
  const health = healthQuery.data;
  const badge = healthLabel(health);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-2">
              Auction Intelligence
            </p>
            <h1 className="text-4xl font-bold text-gray-900">Analytics Console</h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              A detailed view of auction activity, category performance, and the hottest listings.
            </p>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${badge.className}`}>
            <span>{badge.text}</span>
            {health?.latencyMs != null ? <span>• {health.latencyMs} ms</span> : null}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Total Auctions" value={report.totalAuctions} />
          <MetricCard label="Active Auctions" value={report.activeAuctions} />
          <MetricCard label="Total Bids" value={report.totalBids} />
          <MetricCard label="Peak Bid Hour" value={report.peakBidHour ?? "N/A"} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-900">Category Breakdown</h2>
              <span className="text-sm text-gray-500">{report.topCategories.length} categories</span>
            </div>
            <div className="space-y-3">
              {report.topCategories.map((category: AnalyticsCategoryReport) => (
                <div key={category.itemCategory} className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-gray-900">{category.itemCategory}</div>
                      <div className="text-sm text-gray-500">
                        {category.auctionCount} auctions • {category.totalBids} bids
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div>{category.averagePriceGrowthPct}% avg growth</div>
                      <div>{category.averageBids} avg bids</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-900">Hottest Auctions</h2>
              <Link to="/auction" className="text-sm font-medium text-blue-700 hover:text-blue-800">
                Back to auctions
              </Link>
            </div>
            <div className="space-y-3">
              {report.hottestAuctions.map((auction: AnalyticsHotAuction) => (
                <div key={auction.auctionId} className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-gray-900">{auction.itemName}</div>
                      <div className="text-sm text-gray-500">
                        {auction.itemCategory} • {auction.bidCount} bids
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div>+${auction.priceGrowth}</div>
                      <div>{auction.bidVelocityPerMinute} bids/min</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
            <span className="text-sm text-gray-500">
              Generated {new Date(report.generatedAt).toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MiniStat label="Ended" value={report.endedAuctions} />
            <MiniStat label="Upcoming" value={report.upcomingAuctions} />
            <MiniStat label="Avg Bids/Auction" value={report.averageBidsPerAuction} />
          </div>
        </section>
      </main>
    </div>
  );
};

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-gray-900">{value}</div>
    </div>
  );
}

export default Analytics;
