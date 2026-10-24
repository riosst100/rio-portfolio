import "server-only";
import type { Project } from "@prisma/client";
import { parseTech } from "./content";
import { prisma } from "./prisma";

export type ProjectInput = {
  title: string;
  description: string;
  tech: string;
  href: string | null;
  repo: string | null;
};

export function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function str(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

// Shared by the admin form and the REST API. `tech` may be a comma-separated
// string (form) or an array of strings (JSON).
export function validateProject(raw: Record<string, unknown>) {
  const techItems = Array.isArray(raw.tech)
    ? raw.tech.map(str)
    : str(raw.tech).split(",");

  const data: ProjectInput = {
    title: str(raw.title),
    description: str(raw.description),
    tech: techItems.map((t) => t.trim()).filter(Boolean).join(", "),
    href: str(raw.href) || null,
    repo: str(raw.repo) || null,
  };

  const errors: Record<string, string> = {};
  if (!data.title) errors.title = "Judul wajib diisi.";
  else if (data.title.length > 120) errors.title = "Maksimal 120 karakter.";
  if (!data.description) errors.description = "Deskripsi wajib diisi.";
  else if (data.description.length > 1000)
    errors.description = "Maksimal 1000 karakter.";
  if (data.tech.length > 300) errors.tech = "Maksimal 300 karakter.";
  if (data.href && !isValidUrl(data.href))
    errors.href = "URL harus diawali http:// atau https://";
  if (data.repo && !isValidUrl(data.repo))
    errors.repo = "URL harus diawali http:// atau https://";

  return { data, errors };
}

// New projects go to the end of the list.
export async function createProjectRecord(data: ProjectInput) {
  const last = await prisma.project.findFirst({ orderBy: { order: "desc" } });
  return prisma.project.create({
    data: { ...data, order: (last?.order ?? -1) + 1 },
  });
}

export function toProjectJson(p: Project) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    tech: parseTech(p.tech),
    href: p.href,
    repo: p.repo,
    order: p.order,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}
