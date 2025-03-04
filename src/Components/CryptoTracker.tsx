"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

interface Crypto {
    id: string;
    name: string;
    logo: string;
    priceUsd: string;
    rank: number;
    symbol: string;
}

// Getting Top 5 Crypot Currencies
const fetchCryptoPrices = async () => {
    const response = await axios.post("https://graphql.coincap.io/", {
        query: `
      query ($direction: SortDirection, $first: Int, $sort: AssetSortInput) {
        assets(direction: $direction, first: $first, sort: $sort) {
          edges {
            node {
              id
              name
              logo
              priceUsd
              rank
              symbol
            }
          }
        }
      }
    `,
        variables: {
            direction: "ASC",
            first: 5,
            sort: "rank",
        },
    });
    return response.data.data.assets.edges.map((edge: {node:Crypto}) => edge.node);
};

const CryptoTracker = () => {
    const [search, setSearch] = useState("");

    const {
        data: cryptos,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["cryptoPrices"],
        queryFn: fetchCryptoPrices,
    });

    const filteredCryptos = cryptos?.filter((crypto: Crypto) =>
        crypto.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col max-w-3xl mx-auto rounded-lg ">
            <div>
                <h1 className="text-2xl font-bold text-center mb-4">
                    Crypto Price Tracker
                </h1>
            </div>

            {/* Search Bar */}
            <div>
                <input
                    type="text"
                    placeholder="Search Crypto..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
            </div>

            {/* Refresh Button */}
            <div>
                <button
                    onClick={() => refetch()}
                    className="w-full bg-blue-500 text-white py-2 rounded mb-4 hover:bg-blue-600"
                >
                    {isLoading ? "Loading....." : "Refresh Prices"}
                </button>
            </div>
            <div>
                {isLoading && <p className="text-center">Loading...</p>}
                {isError && (
                    <p className="text-center text-red-500">
                        Error fetching data
                    </p>
                )}
            </div>

            {/* Display Crypto Prices */}
            <div>
                {filteredCryptos && (
                    <ul className="space-y-3">
                        {filteredCryptos.map((crypto: Crypto) => (
                            <li
                                key={crypto.id}
                                className="flex items-center justify-between p-3 border rounded"
                            >
                                <div className="flex items-center">
                                    <div className="p-[8px] border rounded-3xl m-[10px]">
                                        {crypto.logo.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold">
                                            {crypto.name} ({crypto.symbol})
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Rank: {crypto.rank}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-lg font-bold">
                                    ${parseFloat(crypto.priceUsd).toFixed(2)}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CryptoTracker;
