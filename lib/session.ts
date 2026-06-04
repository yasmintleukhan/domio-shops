import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function getShopSession() {
  const session = await auth();
  if (!session?.user) return null;
  const user = session.user as any;
  if (user.role !== "shop_owner" && user.role !== "shop_staff") return null;
  return { userId: user.id, shopId: user.shopId, role: user.role };
}

export async function getFounderSession() {
  const session = await auth();
  if (!session?.user) return null;
  const user = session.user as any;
  if (user.role !== "founder") return null;
  return { userId: user.id, shopId: user.shopId, role: user.role };
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
