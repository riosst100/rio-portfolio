import "server-only";
import { prisma } from "./prisma";

export function parseTech(tech: string) {
  return tech
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function getProjects() {
  const rows = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return rows.map((p) => ({ ...p, techList: parseTech(p.tech) }));
}

export async function getContact() {
  const contact = await prisma.contact.findUnique({ where: { id: 1 } });
  return (
    contact ?? {
      id: 1,
      email: "",
      phone: null,
      location: null,
      message: "",
      updatedAt: new Date(),
    }
  );
}

export async function getSocials() {
  return prisma.socialLink.findMany({ orderBy: { order: "asc" } });
}
