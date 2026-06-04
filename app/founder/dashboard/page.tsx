import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/ui/card";
import { Store, Users, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function FounderDashboardPage() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalShops, activeShops, trialShops, expiredShops, mauSessions, topShops] =
    await Promise.all([
      prisma.shop.count(),
      prisma.shop.count({ where: { status: "active" } }),
      prisma.shop.count({ where: { status: "trial" } }),
      prisma.shop.count({ where: { status: "expired" } }),
      prisma.pageView.findMany({
        where: { created_at: { gte: thirtyDaysAgo } },
        select: { session_id: true },
        distinct: ["session_id"],
      }),
      prisma.shop.findMany({
        include: { _count: { select: { page_views: true, order_events: true } } },
        orderBy: { page_views: { _count: "desc" } },
        take: 5,
      }),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#f5f0e8]">Платформа</h2>
        <p className="text-[#888880] text-sm mt-1">Общая статистика</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Всего магазинов" value={totalShops} icon={<Store size={20} />} />
        <StatCard label="Активных" value={activeShops} icon={<TrendingUp size={20} />} />
        <StatCard label="На триале" value={trialShops} icon={<Users size={20} />} />
        <StatCard label="MAU (сессий)" value={mauSessions.length} icon={<AlertCircle size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#f5f0e8] font-semibold">Топ магазинов</h3>
            <Link href="/founder/dashboard/shops" className="text-xs text-[#C9A84C] hover:underline">
              Все магазины →
            </Link>
          </div>
          {topShops.length === 0 ? (
            <p className="text-[#888880] text-sm">Нет магазинов</p>
          ) : (
            <div className="space-y-3">
              {topShops.map((shop) => (
                <div key={shop.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center">
                      <Store size={14} className="text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#f5f0e8] font-medium">{shop.name}</p>
                      <p className="text-xs text-[#888880]">{shop.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={shop.status as any}>{shop.status}</Badge>
                    <span className="text-xs text-[#888880]">{shop._count.page_views} views</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="text-[#f5f0e8] font-semibold mb-4">По статусу</h3>
          <div className="space-y-3">
            {[
              { label: "Активных", value: activeShops, color: "bg-green-500" },
              { label: "На триале", value: trialShops, color: "bg-blue-500" },
              { label: "Истёкших", value: expiredShops, color: "bg-[#888880]" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-sm text-[#888880] flex-1">{item.label}</span>
                <span className="text-sm font-semibold text-[#f5f0e8]">{item.value}</span>
                <div className="w-24 h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: totalShops > 0 ? `${(item.value / totalShops) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
