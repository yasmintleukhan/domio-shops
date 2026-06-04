import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  const { slug, id } = params;

  const shop = await prisma.shop.findUnique({ where: { slug } });
  if (!shop) return NextResponse.json({ error: "Shop not found" }, { status: 404 });

  const product = await prisma.product.findFirst({
    where: { id, shop_id: shop.id, is_active: true },
  });

  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  return NextResponse.json(product);
}
