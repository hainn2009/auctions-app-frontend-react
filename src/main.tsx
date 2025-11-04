import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import InitAuth from "./init/InitAuth.jsx";
import { adminRouter } from "./routers/adminRouter.jsx";
import { openRoutes } from "./routers/openRoutes.jsx";
import { protectedRoutes } from "./routers/protectedRoutes.jsx";
import { store } from "./store/store.js";

const queryClient = new QueryClient();
const router = createBrowserRouter([
    ...adminRouter,
    ...protectedRoutes,
    ...openRoutes,
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <InitAuth>
                    <RouterProvider router={router} />
                </InitAuth>
            </Provider>
        </QueryClientProvider>
    </React.StrictMode>
);
