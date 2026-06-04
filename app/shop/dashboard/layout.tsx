import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar, shopNavItems } from "@/components/dashboard/sidebar";
import { prisma } from "@/lib/prisma";

export default async function ShopDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/shop/login");

  const user = session.user as any;
  if (user.role !== "shop_owner" && user.role !== "shop_staff") {
    redirect("/shop/login");
  }

  const shop = await prisma.shop.findUnique({ where: { id: user.shopId } });

  return (
    <div className="flex h-screen bg-[#0d0d0d] overflow-hidden">
      <Sidebar
        items={shopNavItems}
        shopName={shop?.name}
        logoHref="/shop/dashboard"
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-[#141414] border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-[#f5f0e8] font-semibold">{shop?.name || "Мой магазин"}</h1>
            <p className="text-xs text-[#888880]">{shop?.slug}.domio.top</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/storefront/${shop?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#888880] hover:text-[#C9A84C] transition-colors cursor-pointer"
            >
              Открыть магазин →
            </a>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
