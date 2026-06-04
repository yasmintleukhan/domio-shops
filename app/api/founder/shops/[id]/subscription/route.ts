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
  const { subscription_ends_at, status } = body;

  const shop = await prisma.shop.update({
    where: { id: params.id },
    data: {
      ...(subscription_ends_at !== undefined && {
        subscription_ends_at: subscription_ends_at ? new Date(subscription_ends_at) : null,
      }),
      ...(status !== undefined && { status }),
    },
  });

  return NextResponse.json(shop);
}
