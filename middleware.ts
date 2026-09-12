import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGIN = "http://localhost:8081";

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");

  // CORS для API
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Preflight
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization",
        },
      });
    }

    const response = NextResponse.next();

    if (origin === ALLOWED_ORIGIN) {
      response.headers.set(
        "Access-Control-Allow-Origin",
        ALLOWED_ORIGIN
      );

      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
      );

      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
    }

    return response;
  }

  // Защита страниц
  const token = request.cookies.get("session_token")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/profile/:path*",
    "/cards/:path*",
    "/dashboard/:path*",
    "/card/:path*",
  ],
};