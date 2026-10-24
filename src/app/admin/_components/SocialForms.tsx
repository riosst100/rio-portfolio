"use client";

import { useActionState } from "react";
import { createSocial, type FormState } from "../actions";
import { inputClass, primaryButton, secondaryButton } from "./styles";

function Inputs({
  label,
  href,
  errors,
}: {
  label?: string;
  href?: string;
  errors: Record<string, string>;
}) {
  return (
    <>
      <div className="sm:w-40">
        <input
          name="label"
          aria-label="Label"
          placeholder="GitHub"
          defaultValue={label}
          required
          className={inputClass}
        />
        {errors.label && <p className="mt-1 text-xs text-red-500">{errors.label}</p>}
      </div>
      <div className="flex-1">
        <input
          name="href"
          aria-label="URL"
          placeholder="https://github.com/username"
          defaultValue={href}
          required
          className={inputClass}
        />
        {errors.href && <p className="mt-1 text-xs text-red-500">{errors.href}</p>}
      </div>
    </>
  );
}

export function EditSocialForm({
  action: saveAction,
  label,
  href,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  label: string;
  href: string;
}) {
  const [state, action, pending] = useActionState(saveAction, undefined);

  return (
    <form action={action} className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-start">
      <Inputs
        label={state?.values?.label ?? label}
        href={state?.values?.href ?? href}
        errors={state?.errors ?? {}}
      />
      <button type="submit" disabled={pending} className={secondaryButton}>
        {state?.ok && !pending ? "✓" : "Simpan"}
      </button>
    </form>
  );
}

export function NewSocialForm() {
  const [state, action, pending] = useActionState(createSocial, undefined);

  // React resets the form after a successful action; on error keep what was typed.
  return (
    <form action={action} className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <Inputs
        label={state?.values?.label}
        href={state?.values?.href}
        errors={state?.errors ?? {}}
      />
      <button type="submit" disabled={pending} className={primaryButton}>
        Tambah
      </button>
    </form>
  );
}
