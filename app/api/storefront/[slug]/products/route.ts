import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 20;

  const shop = await prisma.shop.findUnique({ where: { slug } });
  if (!shop) return NextResponse.json({ error: "Shop not found" }, { status: 404 });

  const products = await prisma.product.findMany({
    where: {
      shop_id: shop.id,
      is_active: true,
      ...(category ? { category } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  // Get categories
  const categories = await prisma.product.findMany({
    where: { shop_id: shop.id, is_active: true, category: { not: null } },
    select: { category: true },
    distinct: ["category"],
  });

  return NextResponse.json({
    products,
    categories: categories.map((c) => c.category).filter(Boolean),
    page,
    pageSize,
  });
}
