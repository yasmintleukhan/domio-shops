import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFounderSession, unauthorized } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getFounderSession();
  if (!session) return unauthorized();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalViews, cartAdds, waClicks, products] = await Promise.all([
    prisma.pageView.count({ where: { shop_id: params.id, created_at: { gte: thirtyDaysAgo } } }),
    prisma.pageView.count({ where: { shop_id: params.id, page: "cart", created_at: { gte: thirtyDaysAgo } } }),
    prisma.orderEvent.count({ where: { shop_id: params.id, whatsapp_clicked: true, created_at: { gte: thirtyDaysAgo } } }),
    prisma.product.count({ where: { shop_id: params.id } }),
  ]);

  return NextResponse.json({ totalViews, cartAdds, waClicks, products });
}
