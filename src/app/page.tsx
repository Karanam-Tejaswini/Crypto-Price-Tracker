"use client";
import CurrencyData from "@/Components/CryptoTracker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Home() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <div className="">
                <CurrencyData />
            </div>
        </QueryClientProvider>
    );
}
