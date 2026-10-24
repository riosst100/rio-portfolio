import { getContact, getSocials } from "@/lib/content";
import { verifySession } from "@/lib/session";
import { deleteSocial, moveSocial, updateSocial } from "../../actions";
import { ConfirmButton } from "../../_components/ConfirmButton";
import { ContactForm } from "../../_components/ContactForm";
import { EditSocialForm, NewSocialForm } from "../../_components/SocialForms";
import { iconButton } from "../../_components/styles";

export default async function AdminContactPage() {
  await verifySession();
  const [contact, socials] = await Promise.all([getContact(), getSocials()]);

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Info kontak</h1>
        <p className="mt-1 mb-6 text-sm text-muted">Tampil di bagian “Get in touch” pada website.</p>
        <div className="rounded-lg border border-border bg-card p-6">
          <ContactForm contact={contact} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Link sosial</h2>
        <p className="mt-1 mb-4 text-sm text-muted">GitHub, LinkedIn, dan lainnya.</p>
        <div className="rounded-lg border border-border bg-card">
          <ul className="divide-y divide-border">
            {socials.map((s, i) => (
              <li key={s.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start">
                <div className="flex gap-1">
                  <form action={moveSocial.bind(null, s.id, "up")}>
                    <button type="submit" disabled={i === 0} aria-label="Naikkan" className={iconButton}>
                      ↑
                    </button>
                  </form>
                  <form action={moveSocial.bind(null, s.id, "down")}>
                    <button
                      type="submit"
                      disabled={i === socials.length - 1}
                      aria-label="Turunkan"
                      className={iconButton}
                    >
                      ↓
                    </button>
                  </form>
                </div>
                <EditSocialForm
                  action={updateSocial.bind(null, s.id)}
                  label={s.label}
                  href={s.href}
                />
                <form action={deleteSocial.bind(null, s.id)}>
                  <ConfirmButton
                    message={`Hapus link "${s.label}"?`}
                    className={`${iconButton} py-2 hover:border-red-500! hover:text-red-500!`}
                  >
                    Hapus
                  </ConfirmButton>
                </form>
              </li>
            ))}
          </ul>
          <div className="border-t border-border p-4">
            <p className="mb-2 text-xs font-medium text-muted">Tambah link baru</p>
            <NewSocialForm />
          </div>
        </div>
      </section>
    </div>
  );
}
