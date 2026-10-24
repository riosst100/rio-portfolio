import { revalidatePath } from "next/cache";
import { connection } from "next/server";
import { requireApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { createProjectRecord, toProjectJson, validateProject } from "@/lib/projects";

const MAX_BODY_BYTES = 16 * 1024;

// GET /api/projects — public, same data as the portfolio section of the site.
export async function GET() {
  await connection();
  const rows = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return Response.json({ projects: rows.map(toProjectJson) });
}

// POST /api/projects — requires `Authorization: Bearer <PORTFOLIO_API_KEY>`.
// Body: { title, description, tech?: string[] | "a, b", href?, repo? }
export async function POST(request: Request) {
  const denied = requireApiKey(request);
  if (denied) return denied;

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json(
      { error: "unsupported_media_type", message: "Use Content-Type: application/json." },
      { status: 415 },
    );
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
    return Response.json(
      { error: "payload_too_large", message: `Body must be under ${MAX_BODY_BYTES} bytes.` },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "invalid_json", message: "Body is not valid JSON." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json(
      { error: "invalid_body", message: "Body must be a JSON object." },
      { status: 400 },
    );
  }

  const { data, errors } = validateProject(body as Record<string, unknown>);
  if (Object.keys(errors).length) {
    return Response.json({ error: "validation_failed", fields: errors }, { status: 422 });
  }

  const project = await createProjectRecord(data);
  revalidatePath("/", "layout");

  return Response.json({ project: toProjectJson(project) }, { status: 201 });
}
