import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt, encrypt, SESSION_COOKIE, SESSION_TTL_MS } from "./jwt";

export async function createSession() {
  const token = await encrypt({ role: "admin" });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // Set COOKIE_SECURE=false only when serving the admin over plain HTTP (not localhost).
    secure:
      process.env.NODE_ENV === "production" &&
      process.env.COOKIE_SECURE !== "false",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + SESSION_TTL_MS),
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// Authoritative check: call at the top of every admin page and server action.
export async function verifySession() {
  const cookieStore = await cookies();
  const session = await decrypt(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) redirect("/admin/login");
  return session;
}
