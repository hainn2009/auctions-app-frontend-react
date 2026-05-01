import axios from "axios";
const VITE_AUCTION_API = import.meta.env.VITE_AUCTION_API;

export interface DashboardStatsResponse {
    totalAuctions: number;
    userAuctionCount: number;
    activeAuctions: number;
    latestAuctions: any[];
    latestUserAuctions: any[];
}

export interface AnalyticsCategoryReport {
    itemCategory: string;
    auctionCount: number;
    totalBids: number;
    averageBids: number;
    averagePriceGrowth: number;
    averagePriceGrowthPct: number;
}

export interface AnalyticsHotAuction {
    auctionId: string;
    itemName: string;
    itemCategory: string;
    bidCount: number;
    priceGrowth: number;
    priceGrowthPct: number;
    bidVelocityPerMinute: number;
}

export interface DashboardAnalyticsReport {
    generatedAt: string;
    totalAuctions: number;
    activeAuctions: number;
    endedAuctions: number;
    upcomingAuctions: number;
    totalBids: number;
    averageBidsPerAuction: number;
    averageStartPrice: number;
    averageCurrentPrice: number;
    averagePriceGrowth: number;
    averagePriceGrowthPct: number;
    peakBidHour?: number | null;
    topCategories: AnalyticsCategoryReport[];
    hottestAuctions: AnalyticsHotAuction[];
}

export interface DashboardAnalyticsHealth {
    aiServiceUrl: string;
    status: "healthy" | "unhealthy";
    fallbackMode: boolean;
    latencyMs: number | null;
}


// getting list of all auction
export const getAuctions = async () => {
    try {
        const res = await axios.get(`${VITE_AUCTION_API}`,
            { withCredentials: true }
        );
        return res.data;
    } catch (error) {
        console.log("Error on getting auction data", (error as Error).message);
    }
}

// getting list of all auction
export const getMyAuctions = async () => {
    try {
        const res = await axios.get(`${VITE_AUCTION_API}/myauction`,
            { withCredentials: true }
        );
        return res.data;
    } catch (error) {
        console.log("Error on getting my auction data", (error as Error).message);
    }
}


// getting single auction using _id
export const viewAuction = async (id: string) => {
    try {
        const res = await axios.get(`${VITE_AUCTION_API}/${id}`,
            { withCredentials: true }
        );
        return res.data;
    } catch (error) {
        console.log("Error on getting auction data", (error as Error).message);
    }
}

// placing bid for auction
export const placeBid = async ({ bidAmount, id }: { bidAmount: number; id: string }) => {
    try {
        const res = await axios.post(`${VITE_AUCTION_API}/${id}`,
            { bidAmount },
            { withCredentials: true }
        )
        return res.data;
    } catch (error) {
        console.log("Error placing bid", (error as Error).message);
    }
}


// creating new auction
export const createAuction = async (data: any) => {
    try {

        const formData = new FormData();
        formData.append("itemName", data.itemName);
        formData.append("startingPrice", data.startingPrice);
        formData.append("itemDescription", data.itemDescription);
        formData.append("itemCategory", data.itemCategory);
        formData.append("itemStartDate", data.itemStartDate);
        formData.append("itemEndDate", data.itemEndDate);
        formData.append("itemPhoto", data.itemPhoto);

        const res = await axios.post(`${VITE_AUCTION_API}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            }
        );
        return res.data;
    } catch (error) {
        console.log("Error creating auction", (error as Error).message);
    }
}

// getting single auction using _id
export const dashboardStats = async (): Promise<DashboardStatsResponse> => {
    try {
        const res = await axios.get(`${VITE_AUCTION_API}/stats`,
            { withCredentials: true }
        );
        return res.data;
    } catch (error) {
        console.log("Error on getting dashboard data", (error as Error).message);
        throw error;
    }
}

export const dashboardAnalytics = async (): Promise<DashboardAnalyticsReport> => {
    try {
        const res = await axios.get(`${VITE_AUCTION_API}/analytics`, {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.log("Error on getting analytics report", (error as Error).message);
        throw error;
    }
}

export const dashboardAnalyticsHealth = async (): Promise<DashboardAnalyticsHealth> => {
    try {
        const res = await axios.get(`${VITE_AUCTION_API}/analytics/health`, {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.log("Error on getting analytics health", (error as Error).message);
        return {
            aiServiceUrl: "unknown",
            status: "unhealthy",
            fallbackMode: true,
            latencyMs: null,
        };
    }
}
