import axios, { AxiosError } from "axios";
const VITE_API = import.meta.env.VITE_API;

export const changePassword = async (formData: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    try {
        const res = await axios.patch(`${VITE_API}/user`,
            formData,
            { withCredentials: true }
        );
        return res.data;
    } catch (error) {
        const err = error as AxiosError<{ error?: string }>;
        console.log(err.response?.data?.error || "Can't update password")
        throw error;
    }
}


export const loginHistory = async () => {
    try {
        const res = await axios.get(`${VITE_API}/user/logins`,
            { withCredentials: true }
        );
        return res.data;
    } catch (error) {
        const err = error as AxiosError<{ error?: string }>;
        console.log(err.response?.data?.error || "Can't show login history")
        throw error;
    }
}
