import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Eye, ShoppingCart, MessageCircle, Package } from "lucide-react";

export default async function ShopDetailPage({ params }: { params: { id: string } }) {
  const shop = await prisma.shop.findUnique({
    where: { id: params.id },
    include: {
      users: { select: { id: true, email: true, role: true, last_login_at: true } },
      _count: { select: { products: true, order_events: true, page_views: true } },
    },
  });

  if (!shop) notFound();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [views30, orders30] = await Promise.all([
    prisma.pageView.count({ where: { shop_id: shop.id, created_at: { gte: thirtyDaysAgo } } }),
    prisma.orderEvent.count({ where: { shop_id: shop.id, created_at: { gte: thirtyDaysAgo } } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/founder/dashboard/shops" className="text-[#888880] hover:text-[#f5f0e8] transition-colors cursor-pointer">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-[#f5f0e8]">{shop.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#888880] text-sm">{shop.slug}.domio.top</span>
            <Badge variant={shop.status as any}>{shop.status}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Просмотры (30д)" value={views30} icon={<Eye size={20} />} />
        <StatCard label="Заказы (30д)" value={orders30} icon={<MessageCircle size={20} />} />
        <StatCard label="Всего товаров" value={shop._count.products} icon={<Package size={20} />} />
        <StatCard label="Всего заказов" value={shop._count.order_events} icon={<ShoppingCart size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="text-[#f5f0e8] font-semibold mb-4">Информация</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#888880]">Slug</span>
              <span className="text-[#f5f0e8]">{shop.slug}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888880]">WhatsApp</span>
              <span className="text-[#f5f0e8]">{shop.whatsapp_number}</span>
            </div>
            {shop.custom_domain && (
              <div className="flex justify-between">
                <span className="text-[#888880]">Домен</span>
                <span className="text-[#f5f0e8]">{shop.custom_domain}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#888880]">Создан</span>
              <span className="text-[#f5f0e8]">
                {new Date(shop.created_at).toLocaleDateString("ru-KZ")}
              </span>
            </div>
            {shop.subscription_ends_at && (
              <div className="flex justify-between">
                <span className="text-[#888880]">Подписка до</span>
                <span className="text-[#f5f0e8]">
                  {new Date(shop.subscription_ends_at).toLocaleDateString("ru-KZ")}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="text-[#f5f0e8] font-semibold mb-4">Пользователи</h3>
          {shop.users.length === 0 ? (
            <p className="text-[#888880] text-sm">Нет пользователей</p>
          ) : (
            <div className="space-y-3">
              {shop.users.map((u) => (
                <div key={u.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#f5f0e8]">{u.email}</p>
                    <p className="text-xs text-[#888880]">
                      Последний вход:{" "}
                      {u.last_login_at
                        ? new Date(u.last_login_at).toLocaleDateString("ru-KZ")
                        : "никогда"}
                    </p>
                  </div>
                  <Badge variant="default">{u.role}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
