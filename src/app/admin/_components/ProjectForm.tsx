"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "../actions";
import { Field } from "./Field";
import { primaryButton, secondaryButton } from "./styles";

type Project = {
  title: string;
  description: string;
  tech: string;
  href: string | null;
  repo: string | null;
};

export function ProjectForm({
  action,
  project,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  project?: Project;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const errors = state?.errors ?? {};
  const values: Partial<Record<keyof Project, string | null>> =
    state?.values ?? project ?? {};

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Judul" name="title" required defaultValue={values.title} error={errors.title} />
      <Field
        label="Deskripsi"
        name="description"
        required
        multiline
        defaultValue={values.description}
        error={errors.description}
      />
      <Field
        label="Tech stack"
        name="tech"
        defaultValue={values.tech}
        hint="Pisahkan dengan koma, contoh: Next.js, Prisma, Docker"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Link live"
          name="href"
          type="url"
          placeholder="https://"
          defaultValue={values.href}
          error={errors.href}
        />
        <Field
          label="Link source code"
          name="repo"
          type="url"
          placeholder="https://github.com/…"
          defaultValue={values.repo}
          error={errors.repo}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending} className={primaryButton}>
          {pending ? "Menyimpan…" : "Simpan"}
        </button>
        <Link href="/admin" className={secondaryButton}>
          Batal
        </Link>
      </div>
    </form>
  );
}
