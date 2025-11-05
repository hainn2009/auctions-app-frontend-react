import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const VITE_API = import.meta.env.VITE_API;

interface LoginPayload {
    email: string;
    password: string;
}

interface SignupPayload {
    name: string;
    email: string;
    password: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

// Return user if loggedin
export const checkAuth = createAsyncThunk<User, void, { rejectValue: string }>(
    "auth/checkAuth",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${VITE_API}/user`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue("Not authenticated");
        }
    }
);

// login
export const login = createAsyncThunk<
    User,
    LoginPayload,
    { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
    try {
        await axios.post(
            `${VITE_API}/auth/login`,
            { email, password },
            {
                withCredentials: true,
            }
        );

        const response = await axios.get(`${VITE_API}/user`, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        const err = error as AxiosError<{ error?: string }>;
        return rejectWithValue(err.response?.data?.error || "Login failed");
    }
});

// signup
export const signup = createAsyncThunk<
    User,
    SignupPayload,
    { rejectValue: string }
>("auth/signup", async ({ name, email, password }, { rejectWithValue }) => {
    try {
        await axios.post(
            `${VITE_API}/auth/signup`,
            { name, email, password },
            {
                withCredentials: true,
            }
        );

        const response = await axios.get(`${VITE_API}/user`, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        const err = error as AxiosError<{ error?: string }>;
        return rejectWithValue(err.response?.data?.error || "Signup failed");
    }
});

// logout
export const logout = createAsyncThunk<null, void, { rejectValue: string }>(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await axios.post(
                `${VITE_API}/auth/logout`,
                {},
                {
                    withCredentials: true,
                }
            );
            return null;
        } catch (error) {
            return rejectWithValue("Logout failed");
        }
    }
);

// initial auth state
const initialState: AuthState = {
    user: null,
    loading: true,
    error: null,
};

// auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // checkAuth
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, { payload }) => {
                state.user = payload;
                state.loading = false;
            })
            .addCase(checkAuth.rejected, (state, { payload }) => {
                state.user = null;
                state.error = payload ?? "Unknown error";
                state.loading = false;
            })

            // login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.user = payload;
                state.loading = false;
            })
            .addCase(login.rejected, (state, { payload }) => {
                state.user = null;
                state.error = payload ?? "Login failed";
                state.loading = false;
            })

            // signup
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, { payload }) => {
                state.user = payload;
                state.loading = false;
            })
            .addCase(signup.rejected, (state, { payload }) => {
                state.user = null;
                state.error = payload ?? "Signup failed";
                state.loading = false;
            })

            // logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.loading = false;
                state.error = null;
            })
            .addCase(logout.rejected, (state, { payload }) => {
                state.error = payload ?? "Logout failed";
            });
    },
});

export default authSlice.reducer;
