"use client";

import { useActionState } from "react";
import { updateContact } from "../actions";
import { Field } from "./Field";
import { primaryButton } from "./styles";

type Contact = {
  email: string;
  phone: string | null;
  location: string | null;
  message: string;
};

export function ContactForm({ contact }: { contact: Contact }) {
  const [state, action, pending] = useActionState(updateContact, undefined);
  const errors = state?.errors ?? {};
  const values: Partial<Record<keyof Contact, string | null>> =
    state?.values ?? contact;

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Email"
          name="email"
          type="email"
          required
          defaultValue={values.email}
          error={errors.email}
        />
        <Field label="Telepon / WhatsApp" name="phone" defaultValue={values.phone} />
      </div>
      <Field label="Lokasi" name="location" defaultValue={values.location} />
      <Field
        label="Pesan di bagian kontak"
        name="message"
        multiline
        defaultValue={values.message}
        error={errors.message}
      />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={primaryButton}>
          {pending ? "Menyimpan…" : "Simpan kontak"}
        </button>
        {state?.ok && <p className="text-sm text-accent">{state.message}</p>}
      </div>
    </form>
  );
}
