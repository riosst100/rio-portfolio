// Edge-safe JWT helpers, shared by proxy.ts and the server-only session module.
import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "admin_session";
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set and at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function encrypt(payload: { role: "admin" }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + SESSION_TTL_MS))
    .sign(key());
}

export async function decrypt(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), {
      algorithms: ["HS256"],
    });
    return payload.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}
