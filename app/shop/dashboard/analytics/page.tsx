"use client";
import { useState, useEffect } from "react";
import { StatCard } from "@/components/ui/card";
import { Eye, ShoppingCart, MessageCircle, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Analytics {
  totalViews: number;
  cartAdds: number;
  waClicks: number;
  conversion: string;
  viewsByDay: { date: string; count: number }[];
  topProducts: { product: { id: string; name: string; price: string } | null; views: number }[];
  referrers: { referrer: string | null; count: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shop/analytics")
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
        <h2 className="text-2xl font-bold text-[#f5f0e8]">Аналитика</h2>
        <p className="text-[#888880] text-sm mt-1">За последние 30 дней</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Просмотры" value={data.totalViews} icon={<Eye size={20} />} />
        <StatCard label="В корзину" value={data.cartAdds} icon={<ShoppingCart size={20} />} />
        <StatCard label="WA клики" value={data.waClicks} icon={<MessageCircle size={20} />} />
        <StatCard label="Конверсия" value={`${data.conversion}%`} icon={<TrendingUp size={20} />} />
      </div>

      {/* Views by day chart */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
        <h3 className="text-[#f5f0e8] font-semibold mb-6">Просмотры по дням</h3>
        {data.viewsByDay.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.viewsByDay} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis
                dataKey="date"
                tick={{ fill: "#888880", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => {
                  const d = new Date(v);
                  return `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
                }}
              />
              <YAxis tick={{ fill: "#888880", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "12px", color: "#f5f0e8" }}
                cursor={{ fill: "#C9A84C10" }}
              />
              <Bar dataKey="count" fill="#C9A84C" radius={[4, 4, 0, 0]} name="Просмотры" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-[#888880] text-sm text-center py-8">Нет данных</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="text-[#f5f0e8] font-semibold mb-4">Топ товаров</h3>
          {data.topProducts.length === 0 ? (
            <p className="text-[#888880] text-sm">Нет данных</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left py-2 text-[#888880] font-medium">Товар</th>
                  <th className="text-right py-2 text-[#888880] font-medium">Просмотры</th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.map((tp, i) => (
                  <tr key={i} className="border-b border-[#2a2a2a] last:border-0">
                    <td className="py-2 text-[#f5f0e8]">{tp.product?.name || "—"}</td>
                    <td className="py-2 text-right text-[#C9A84C] font-semibold">{tp.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Referrers */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="text-[#f5f0e8] font-semibold mb-4">Источники трафика</h3>
          {data.referrers.length === 0 ? (
            <p className="text-[#888880] text-sm">Нет данных</p>
          ) : (
            <div className="space-y-2">
              {data.referrers.map((r, i) => (
                <div key={i} className="flex justify-between items-center py-1.5">
                  <span className="text-[#888880] text-sm truncate max-w-[200px]">
                    {r.referrer || "Прямой"}
                  </span>
                  <span className="text-[#f5f0e8] font-semibold text-sm">{r.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
