import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // Not secure optimistic redirection, this is done on all pages anyways.
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // Specify the routes the middleware applies to
};
