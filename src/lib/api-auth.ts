import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

function sha256(value: string) {
  return createHash("sha256").update(value).digest();
}

// Returns an error Response when the request isn't allowed to write, otherwise null.
export function requireApiKey(request: Request) {
  const expected = process.env.PORTFOLIO_API_KEY;
  if (!expected || expected.length < 32) {
    return Response.json(
      { error: "api_disabled", message: "PORTFOLIO_API_KEY is not configured on the server." },
      { status: 503 },
    );
  }

  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token || !timingSafeEqual(sha256(token), sha256(expected))) {
    return Response.json(
      { error: "unauthorized", message: "Send the API key as 'Authorization: Bearer <key>'." },
      { status: 401, headers: { "WWW-Authenticate": "Bearer" } },
    );
  }

  return null;
}
