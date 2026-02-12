import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
const VITE_API = import.meta.env.VITE_API;

interface AuctionState {
    auctions: any[] | null;
    loading: boolean;
    error: string | null;
    userData: any | null;
    userProducts: any[];
    auctionById: any[];
}

const initialState: AuctionState = {
    auctions: null,
    loading: false,
    error: null,
    userData: null,
    userProducts: [],
    auctionById: [],
};


export const fetchAuctions = createAsyncThunk(
    'auctions/fetchAuctions',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            const response = await axios.get(`${VITE_API}/api/auction/show`);
            return response.data;
        } catch (error) {
            const err = error as AxiosError<any>;
            return rejectWithValue(err.response?.data);
        }
    }
);

export const fetchUserAndProducts = createAsyncThunk(
    'auctions/fetchUserAndProducts',
    async (userId: string, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            const response = await axios.get(`${VITE_API}/api/${userId}`);
            return response.data;
        } catch (error) {
            const err = error as AxiosError<any>;
            return rejectWithValue(err.response?.data?.message || "An unexpected error occurred.");
        }
    }
);

export const fetchAuctionById = createAsyncThunk(
    'auctions/fetchAuctionById',
    async (productId: string, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            const response = await axios.get(`${VITE_API}/api/auction/${productId}`);
            return response.data;
        } catch (error) {
            const err = error as AxiosError<any>;
            return rejectWithValue(err.response?.data?.message || "An unexpected error occurred.");
        }
    }
);

const auctionSlice = createSlice({
    name: 'auctions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuctions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAuctions.fulfilled, (state, action) => {
                state.loading = false;
                state.auctions = action.payload.auctions;
            })
            .addCase(fetchAuctions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // cases for fetchUserAndProducts
            .addCase(fetchUserAndProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserAndProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.userData = action.payload.user;
                state.userProducts = action.payload.products;
            })
            .addCase(fetchUserAndProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Single ID
            .addCase(fetchAuctionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAuctionById.fulfilled, (state, action) => {
                state.loading = false;
                state.auctionById = action.payload.auction;
            })
            .addCase(fetchAuctionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

    },
});

export default auctionSlice.reducer;
