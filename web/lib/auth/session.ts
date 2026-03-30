import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

export type AdminSession = {
  uid: string;
  email: string;
};

function normalizeEmail(email: string | undefined): string | null {
  if (!email) return null;
  return email.trim().toLowerCase();
}

/**
 * Verifies the HttpOnly session cookie and enforces single-admin email allowlist.
 */
export async function verifyAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  const allowed = normalizeEmail(process.env.ADMIN_EMAIL);
  if (!allowed) return null;

  try {
    const auth = getAuth(getAdminApp());
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    const email = normalizeEmail(decoded.email);
    if (!email || email !== allowed) return null;
    return { uid: decoded.uid, email };
  } catch {
    return null;
  }
}
