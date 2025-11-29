import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Server-side utility to check authentication and redirect if not authenticated.
 * Use this in server components, server actions, and API routes that require authentication.
 *
 * @returns The authenticated session
 * @throws Redirects to /login if no valid session exists
 */
export async function requireAuth() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      redirect("/login");
    }

    return session;
  } catch (error) {
    console.error("Authentication check failed:", error);
    redirect("/login");
  }
}
