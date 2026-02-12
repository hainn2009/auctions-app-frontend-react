import axios, { AxiosError } from "axios";
const VITE_API = import.meta.env.VITE_API;

export const sendMessage = async (formData: { name: string; email: string; subject: string; message: string }) => {
    try {
        const res = await axios.post(`${VITE_API}/contact`,
            formData,
        )
        return res.data;
    } catch (error) {
        const err = error as AxiosError<{ error?: string }>;
        console.log(err.response?.data?.error || "Something went wrong");
        throw error;
    }
}
