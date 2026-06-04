import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getShopSession, unauthorized } from "@/lib/session";

export async function PATCH(request: NextRequest) {
  const session = await getShopSession();
  if (!session) return unauthorized();

  const body = await request.json();
  const { items } = body; // [{id, sort_order}]

  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "items array required" }, { status: 400 });
  }

  await Promise.all(
    items.map(({ id, sort_order }: { id: string; sort_order: number }) =>
      prisma.product.updateMany({
        where: { id, shop_id: session.shopId },
        data: { sort_order },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
