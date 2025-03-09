import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function SellerLeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      console.log("Fetching leaderboard data...");

      try {
        if (!userId) {
          setError("User ID not found.");
          setLoading(false);
          console.log("User ID not found, cannot fetch leaderboard.");
          return;
        }
        console.log("User ID:", userId);

        const { data, error } = await supabase
          .from('leaderboard')
          .select('*')
          .order('rank', { ascending: true });

        if (error) {
          setError(error);
          console.error("Supabase error fetching leaderboard:", error);
        } else {
          console.log("Raw Supabase data:", data);
          setLeaderboardData(data);
          console.log("Leaderboard data fetched successfully:", data);
        }
      } catch (err) {
        setError(err);
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
        console.log("Fetching leaderboard data completed.");
      }
    };

    fetchLeaderboard();
  }, [userId]);

  if (loading) {
    console.log("Leaderboard is loading...");
    return <div className="p-4">Loading leaderboard data...</div>;
  }

  if (error) {
    console.error("Leaderboard error during render:", error);
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  console.log("Leaderboard rendering with data:", leaderboardData);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Seller Leaderboard</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seller
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU Count
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pricing Score
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sales Volume
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fulfillment Rate
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboardData.map((seller, index) => (
              <tr
                key={seller.id}
                className={`${seller.profile_id === userId ? 'bg-green-50' : 'hover:bg-gray-50'} transition-colors`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      index === 0 ? 'bg-green-500 text-white' :
                      index === 1 ? 'bg-green-400 text-white' :
                      index === 2 ? 'bg-green-300 text-white' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{seller.seller_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{seller.sku_count}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{seller.competitive_pricing_score}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₹{seller.sales_volume}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{seller.order_fulfillment_rate}%</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
