import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFounderSession, unauthorized } from "@/lib/session";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getFounderSession();
  if (!session) return unauthorized();

  const body = await request.json();
  const { status } = body;

  if (!["active", "suspended", "trial", "expired"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const shop = await prisma.shop.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json(shop);
}
