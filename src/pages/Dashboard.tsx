import AuctionCard from "../components/AuctionCard.js";
import LoadingScreen from "../components/LoadingScreen.js";
import {
  AnalyticsCategoryReport,
  AnalyticsHotAuction,
  dashboardAnalytics,
  dashboardAnalyticsHealth,
  DashboardAnalyticsReport,
  DashboardAnalyticsHealth,
  DashboardStatsResponse,
  dashboardStats,
} from "../api/auction.js";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

const Dashboard = () => {
  const statsQuery = useQuery<DashboardStatsResponse, Error>({
    queryKey: ["stats"],
    queryFn: dashboardStats,
    staleTime: 30 * 1000,
  });

  const analyticsQuery = useQuery<DashboardAnalyticsReport, Error>({
    queryKey: ["analytics"],
    queryFn: dashboardAnalytics,
    staleTime: 30 * 1000,
  });

  const healthQuery = useQuery<DashboardAnalyticsHealth, Error>({
    queryKey: ["analytics-health"],
    queryFn: dashboardAnalyticsHealth,
    staleTime: 30 * 1000,
  });

  if (statsQuery.isLoading) return <LoadingScreen />;

  if (statsQuery.isError || !statsQuery.data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white border border-red-200 text-red-700 rounded-sm p-4">
          Failed to load dashboard stats.
        </div>
      </div>
    );
  }

  const stats = statsQuery.data;
  const report = analyticsQuery.data;
  const health = healthQuery.data;

  return (
    <div className="bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Auctions</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.totalAuctions}
            </p>
          </div>
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Active Auctions</h3>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stats.activeAuctions}
            </p>
          </div>
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Your Auctions</h3>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {stats.userAuctionCount}
            </p>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Analytics Report</h2>
              <p className="text-sm text-gray-500">
                Generated from all auctions via the Python report service.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  health?.status === "healthy"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {health?.status === "healthy" ? "AI service healthy" : "Using fallback analytics"}
              </span>
              {report ? (
                <span className="text-xs text-gray-500">
                  Updated {new Date(report.generatedAt).toLocaleString()}
                </span>
              ) : (
                <span className="text-xs text-gray-500">Analytics loading...</span>
              )}
            </div>
          </div>

          {!report ? (
            <div className="bg-white border border-yellow-200 text-yellow-800 rounded-sm p-4">
              Analytics are not available right now, but the rest of the dashboard is still working.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
                  <div className="text-sm text-gray-500">Ended</div>
                  <div className="text-xl font-semibold text-gray-900">{report.endedAuctions}</div>
                </div>
                <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
                  <div className="text-sm text-gray-500">Upcoming</div>
                  <div className="text-xl font-semibold text-gray-900">{report.upcomingAuctions}</div>
                </div>
                <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
                  <div className="text-sm text-gray-500">Total Bids</div>
                  <div className="text-xl font-semibold text-gray-900">{report.totalBids}</div>
                </div>
                <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
                  <div className="text-sm text-gray-500">Peak Bid Hour</div>
                  <div className="text-xl font-semibold text-gray-900">
                    {report.peakBidHour ?? "N/A"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Top Categories
                  </h3>
                  <div className="space-y-3">
                    {report.topCategories.map((category: AnalyticsCategoryReport) => (
                      <div
                        key={category.itemCategory}
                        className="flex items-center justify-between border-b border-gray-100 pb-3"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {category.itemCategory}
                          </div>
                          <div className="text-xs text-gray-500">
                            {category.auctionCount} auctions, {category.totalBids} bids
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <div>{category.averagePriceGrowthPct}% avg growth</div>
                          <div>{category.averageBids} avg bids</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Hottest Auctions
                  </h3>
                  <div className="space-y-3">
                    {report.hottestAuctions.map((auction: AnalyticsHotAuction) => (
                      <div
                        key={auction.auctionId}
                        className="flex items-center justify-between border-b border-gray-100 pb-3"
                      >
                        <div>
                          <div className="font-medium text-gray-900">{auction.itemName}</div>
                          <div className="text-xs text-gray-500">
                            {auction.itemCategory} - {auction.bidCount} bids
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <div>+${auction.priceGrowth}</div>
                          <div>{auction.bidVelocityPerMinute} bids/min</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="mt-4 flex justify-end">
            <Link
              to="/analytics"
              className="text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              Open detailed analytics
            </Link>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Auctions</h2>
            <Link
              to="/auction"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
            >
              View More
            </Link>
          </div>

          {stats.latestAuctions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-sm shadow-sm border border-gray-200">
              <p className="text-gray-500 text-lg">
                No auctions available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center gap-4">
              {stats.latestAuctions.map((auction: any) => (
                <AuctionCard key={auction._id} auction={auction} />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Auctions</h2>
            <Link
              to="/myauction"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
            >
              View More
            </Link>
          </div>

          {stats.latestUserAuctions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-sm shadow-sm border border-gray-200">
              <p className="text-gray-500 text-lg">
                You haven't created any auctions yet.
              </p>{" "}
              <Link to="/create">
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-sm hover:bg-blue-700 transition-colors">
                  Create Your First Auction
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center gap-4">
              {stats.latestUserAuctions.map((auction: any) => (
                <AuctionCard key={auction._id} auction={auction} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
