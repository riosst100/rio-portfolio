"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createProjectRecord, isValidUrl, validateProject } from "@/lib/projects";
import { createSession, deleteSession, verifySession } from "@/lib/session";

export type FormState =
  | {
      errors?: Record<string, string>;
      // Submitted values, echoed back so the form keeps them after a failed submit.
      values?: Record<string, string>;
      message?: string;
      ok?: boolean;
    }
  | undefined;

// ---------- helpers ----------

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function fail(errors: Record<string, string>, formData: FormData): FormState {
  const values: Record<string, string> = {};
  formData.forEach((v, k) => {
    if (typeof v === "string" && !k.startsWith("$")) values[k] = v;
  });
  return { errors, values };
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest();
}

// Public page and admin both read from the DB, so refresh everything.
function refreshAll() {
  revalidatePath("/", "layout");
}

// Swap `id` with its neighbour, then renumber so `order` stays 0..n-1.
async function move(
  model: "project" | "socialLink",
  id: string,
  direction: "up" | "down",
) {
  const rows =
    model === "project"
      ? await prisma.project.findMany({
          orderBy: [{ order: "asc" }, { createdAt: "asc" }],
          select: { id: true },
        })
      : await prisma.socialLink.findMany({
          orderBy: { order: "asc" },
          select: { id: true },
        });

  const ids = rows.map((r) => r.id);
  const i = ids.indexOf(id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i === -1 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];

  await prisma.$transaction(
    ids.map((rowId, order) =>
      model === "project"
        ? prisma.project.update({ where: { id: rowId }, data: { order } })
        : prisma.socialLink.update({ where: { id: rowId }, data: { order } }),
    ),
  );
}

// ---------- auth ----------

export async function login(_state: FormState, formData: FormData) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return { message: "ADMIN_PASSWORD belum di-set di server." };
  }

  const password = field(formData, "password");
  if (!timingSafeEqual(sha256(password), sha256(expected))) {
    await new Promise((r) => setTimeout(r, 500));
    return { message: "Password salah." };
  }

  await createSession();
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

// ---------- projects ----------

function parseProject(formData: FormData) {
  return validateProject(Object.fromEntries(formData));
}

export async function createProject(_state: FormState, formData: FormData) {
  await verifySession();
  const { data, errors } = parseProject(formData);
  if (Object.keys(errors).length) return fail(errors, formData);

  await createProjectRecord(data);

  refreshAll();
  redirect("/admin");
}

export async function updateProject(
  id: string,
  _state: FormState,
  formData: FormData,
) {
  await verifySession();
  const { data, errors } = parseProject(formData);
  if (Object.keys(errors).length) return fail(errors, formData);

  await prisma.project.update({ where: { id }, data });

  refreshAll();
  redirect("/admin");
}

export async function deleteProject(id: string) {
  await verifySession();
  await prisma.project.deleteMany({ where: { id } });
  refreshAll();
}

export async function moveProject(id: string, direction: "up" | "down") {
  await verifySession();
  await move("project", id, direction);
  refreshAll();
}

// ---------- contact ----------

export async function updateContact(_state: FormState, formData: FormData) {
  await verifySession();
  const data = {
    email: field(formData, "email"),
    phone: field(formData, "phone") || null,
    location: field(formData, "location") || null,
    message: field(formData, "message"),
  };

  const errors: Record<string, string> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Email tidak valid.";
  if (data.message.length > 500) errors.message = "Maksimal 500 karakter.";
  if (Object.keys(errors).length) return fail(errors, formData);

  await prisma.contact.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });

  refreshAll();
  return { ok: true, message: "Info kontak tersimpan." };
}

// ---------- social links ----------

function parseSocial(formData: FormData) {
  const data = { label: field(formData, "label"), href: field(formData, "href") };
  const errors: Record<string, string> = {};
  if (!data.label) errors.label = "Label wajib diisi.";
  else if (data.label.length > 40) errors.label = "Maksimal 40 karakter.";
  if (!isValidUrl(data.href))
    errors.href = "URL harus diawali http://, https:// atau mailto:";
  return { data, errors };
}

export async function createSocial(_state: FormState, formData: FormData) {
  await verifySession();
  const { data, errors } = parseSocial(formData);
  if (Object.keys(errors).length) return fail(errors, formData);

  const last = await prisma.socialLink.findFirst({ orderBy: { order: "desc" } });
  await prisma.socialLink.create({
    data: { ...data, order: (last?.order ?? -1) + 1 },
  });

  refreshAll();
  return { ok: true };
}

export async function updateSocial(
  id: string,
  _state: FormState,
  formData: FormData,
) {
  await verifySession();
  const { data, errors } = parseSocial(formData);
  if (Object.keys(errors).length) return fail(errors, formData);

  await prisma.socialLink.update({ where: { id }, data });

  refreshAll();
  return { ok: true, message: "Tersimpan." };
}

export async function deleteSocial(id: string) {
  await verifySession();
  await prisma.socialLink.deleteMany({ where: { id } });
  refreshAll();
}

export async function moveSocial(id: string, direction: "up" | "down") {
  await verifySession();
  await move("socialLink", id, direction);
  refreshAll();
}
