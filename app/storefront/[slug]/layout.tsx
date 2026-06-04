import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CartProvider } from "@/components/storefront/cart-context";

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const shop = await prisma.shop.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      slug: true,
      name: true,
      logo_url: true,
      whatsapp_number: true,
      theme: true,
      status: true,
    },
  });

  if (!shop || shop.status === "suspended") notFound();

  const theme = shop.theme as { accent: string; button_color: string; font: string };

  return (
    <CartProvider shopSlug={params.slug}>
      <div
        style={
          {
            "--shop-accent": theme.accent || "#C9A84C",
            "--shop-button": theme.button_color || "#C9A84C",
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </CartProvider>
  );
}
