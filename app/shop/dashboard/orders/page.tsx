"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface Order {
  id: string;
  session_id: string;
  product_ids: string[];
  product_names: string[];
  cart_total: string;
  whatsapp_clicked: boolean;
  created_at: string;
}

const periods = [
  { value: "today", label: "Сегодня" },
  { value: "7d", label: "7 дней" },
  { value: "30d", label: "30 дней" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7d");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/shop/orders?period=${period}`)
      .then((r) => r.json())
      .then((data) => { setOrders(data); setLoading(false); });
  }, [period]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#f5f0e8]">Заказы</h2>
          <p className="text-[#888880] text-sm mt-1">{orders.length} заказов</p>
        </div>
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                period === p.value
                  ? "bg-[#C9A84C] text-[#0d0d0d]"
                  : "border border-[#2a2a2a] text-[#888880] hover:text-[#f5f0e8]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#C9A84C] border-t-transparent" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-[#888880]">
          <MessageCircle className="mx-auto mb-4 opacity-40" size={48} />
          <p>Заказов пока нет</p>
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left px-4 py-3 text-[#888880] font-medium">Дата</th>
                <th className="text-left px-4 py-3 text-[#888880] font-medium">Товары</th>
                <th className="text-right px-4 py-3 text-[#888880] font-medium">Сумма</th>
                <th className="text-center px-4 py-3 text-[#888880] font-medium">WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[#2a2a2a] last:border-0 hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-4 py-3 text-[#888880] whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString("ru-KZ", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-[#f5f0e8] max-w-xs">
                    <p className="truncate">
                      {order.product_names.length > 0
                        ? order.product_names.slice(0, 3).join(", ")
                        : `${order.product_ids.length} товар(ов)`}
                      {order.product_names.length > 3 && ` +${order.product_names.length - 3}`}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right text-[#C9A84C] font-semibold">
                    {formatPrice(order.cart_total)} ₸
                  </td>
                  <td className="px-4 py-3 text-center">
                    {order.whatsapp_clicked ? (
                      <Badge variant="success">
                        <MessageCircle size={12} className="mr-1" />
                        Отправлен
                      </Badge>
                    ) : (
                      <Badge variant="expired">Нет</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
