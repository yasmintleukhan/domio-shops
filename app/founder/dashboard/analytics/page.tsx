"use client";
import { useState, useEffect } from "react";
import { StatCard } from "@/components/ui/card";
import { Store, Users, TrendingUp, ShoppingCart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface PlatformAnalytics {
  totalShops: number;
  activeShops: number;
  trialShops: number;
  expiredShops: number;
  suspendedShops: number;
  mau: number;
  topShops: { id: string; slug: string; name: string; status: string; views: number; orders: number }[];
  shopGrowth: { month: string; count: number }[];
}

export default function FounderAnalyticsPage() {
  const [data, setData] = useState<PlatformAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/founder/analytics/platform")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#C9A84C] border-t-transparent" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#f5f0e8]">Аналитика платформы</h2>
        <p className="text-[#888880] text-sm mt-1">Общая статистика</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Всего магазинов" value={data.totalShops} icon={<Store size={20} />} />
        <StatCard label="Активных" value={data.activeShops} icon={<TrendingUp size={20} />} />
        <StatCard label="MAU" value={data.mau} sub="уникальных сессий" icon={<Users size={20} />} />
        <StatCard label="Истёкших" value={data.expiredShops} icon={<ShoppingCart size={20} />} />
      </div>

      {/* Growth chart */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
        <h3 className="text-[#f5f0e8] font-semibold mb-6">Рост магазинов (6 мес)</h3>
        {data.shopGrowth.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.shopGrowth} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="month" tick={{ fill: "#888880", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#888880", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "12px", color: "#f5f0e8" }}
                cursor={{ fill: "#C9A84C10" }}
              />
              <Bar dataKey="count" fill="#C9A84C" radius={[4, 4, 0, 0]} name="Магазины" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-[#888880] text-sm text-center py-8">Нет данных</p>
        )}
      </div>

      {/* Top shops */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
        <h3 className="text-[#f5f0e8] font-semibold mb-4">Топ магазинов по просмотрам</h3>
        {data.topShops.length === 0 ? (
          <p className="text-[#888880] text-sm">Нет данных</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left py-2 text-[#888880] font-medium">Магазин</th>
                <th className="text-right py-2 text-[#888880] font-medium">Просмотры</th>
                <th className="text-right py-2 text-[#888880] font-medium">Заказы</th>
              </tr>
            </thead>
            <tbody>
              {data.topShops.map((shop) => (
                <tr key={shop.id} className="border-b border-[#2a2a2a] last:border-0">
                  <td className="py-2">
                    <p className="text-[#f5f0e8]">{shop.name}</p>
                    <p className="text-xs text-[#888880]">{shop.slug}</p>
                  </td>
                  <td className="py-2 text-right text-[#C9A84C] font-semibold">{shop.views}</td>
                  <td className="py-2 text-right text-[#f5f0e8]">{shop.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
