import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Skip static files and api/auth
  if (pathname.startsWith("/_next") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Strip port for local dev
  const host = hostname.split(":")[0];

  // Determine subdomain
  let subdomain = "";
  if (host === "shop.domio.top" || host === "shop.localhost") {
    subdomain = "shop";
  } else if (host === "founder.domio.top" || host === "founder.localhost") {
    subdomain = "founder";
  } else if (host.endsWith(".domio.top")) {
    subdomain = host.replace(".domio.top", "");
  } else if (host.endsWith(".localhost")) {
    subdomain = host.replace(".localhost", "");
  }

  // Helper to get JWT token
  const getJwt = () =>
    getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Route based on subdomain
  if (subdomain === "shop") {
    if (!pathname.startsWith("/shop/login") && !pathname.startsWith("/api/")) {
      const token = await getJwt();
      if (!token || (token.role !== "shop_owner" && token.role !== "shop_staff")) {
        url.pathname = "/shop/login";
        return NextResponse.redirect(url);
      }
    }
    if (!pathname.startsWith("/shop")) {
      url.pathname = `/shop${pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  if (subdomain === "founder") {
    if (!pathname.startsWith("/founder/login") && !pathname.startsWith("/api/")) {
      const token = await getJwt();
      if (!token || token.role !== "founder") {
        url.pathname = "/founder/login";
        return NextResponse.redirect(url);
      }
    }
    if (!pathname.startsWith("/founder")) {
      url.pathname = `/founder${pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  if (subdomain && subdomain !== "www") {
    // Storefront subdomain
    if (!pathname.startsWith("/storefront")) {
      url.pathname = `/storefront/${subdomain}${pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // On main domain: protect /shop/* and /founder/*
  if (pathname.startsWith("/shop/dashboard")) {
    const token = await getJwt();
    if (!token || (token.role !== "shop_owner" && token.role !== "shop_staff")) {
      url.pathname = "/shop/login";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/founder/dashboard")) {
    const token = await getJwt();
    if (!token || token.role !== "founder") {
      url.pathname = "/founder/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
