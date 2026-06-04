import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/ui/card";
import { Eye, ShoppingCart, MessageCircle, Package } from "lucide-react";

export default async function ShopDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/shop/login");

  const user = session.user as any;
  const shopId = user.shopId;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalViews, cartAdds, waClicks, totalProducts, recentOrders] = await Promise.all([
    prisma.pageView.count({ where: { shop_id: shopId, created_at: { gte: thirtyDaysAgo } } }),
    prisma.pageView.count({ where: { shop_id: shopId, page: "cart", created_at: { gte: thirtyDaysAgo } } }),
    prisma.orderEvent.count({ where: { shop_id: shopId, whatsapp_clicked: true, created_at: { gte: thirtyDaysAgo } } }),
    prisma.product.count({ where: { shop_id: shopId } }),
    prisma.orderEvent.findMany({
      where: { shop_id: shopId },
      orderBy: { created_at: "desc" },
      take: 5,
    }),
  ]);

  const conversion = totalViews > 0 ? ((waClicks / totalViews) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#f5f0e8]">Обзор</h2>
        <p className="text-[#888880] text-sm mt-1">За последние 30 дней</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Просмотры" value={totalViews} sub="страниц" icon={<Eye size={20} />} />
        <StatCard label="Добавлено в корзину" value={cartAdds} sub="товаров" icon={<ShoppingCart size={20} />} />
        <StatCard label="WhatsApp клики" value={waClicks} sub="заказов" icon={<MessageCircle size={20} />} />
        <StatCard label="Конверсия" value={`${conversion}%`} sub="просмотры → заказы" icon={<Package size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="text-[#f5f0e8] font-semibold mb-4">Последние заказы</h3>
          {recentOrders.length === 0 ? (
            <p className="text-[#888880] text-sm">Пока нет заказов</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-[#2a2a2a] last:border-0">
                  <div>
                    <p className="text-sm text-[#f5f0e8]">
                      {order.product_ids.length} товар(ов)
                    </p>
                    <p className="text-xs text-[#888880]">
                      {new Date(order.created_at).toLocaleDateString("ru-KZ")}
                    </p>
                  </div>
                  <span className="text-[#C9A84C] font-semibold text-sm">
                    {parseFloat(order.cart_total.toString()).toLocaleString()} ₸
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="text-[#f5f0e8] font-semibold mb-4">Статистика</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#888880] text-sm">Всего товаров</span>
              <span className="text-[#f5f0e8] font-semibold">{totalProducts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#888880] text-sm">Просмотры (30д)</span>
              <span className="text-[#f5f0e8] font-semibold">{totalViews}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#888880] text-sm">WA клики (30д)</span>
              <span className="text-[#f5f0e8] font-semibold">{waClicks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#888880] text-sm">Конверсия</span>
              <span className="text-[#C9A84C] font-semibold">{conversion}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
