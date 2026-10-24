import Link from "next/link";
import { getProjects } from "@/lib/content";
import { verifySession } from "@/lib/session";
import { deleteProject, moveProject } from "../actions";
import { ConfirmButton } from "../_components/ConfirmButton";
import { iconButton, primaryButton } from "../_components/styles";

export default async function AdminProjectsPage() {
  await verifySession();
  const projects = await getProjects();

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Portfolio</h1>
          <p className="mt-1 text-sm text-muted">
            {projects.length} project · urutan di sini = urutan di website
          </p>
        </div>
        <Link href="/admin/projects/new" className={primaryButton}>
          + Tambah project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted">
          Belum ada project. Klik “Tambah project” untuk mulai.
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {projects.map((p, i) => (
            <li key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="flex gap-1 sm:flex-col">
                <form action={moveProject.bind(null, p.id, "up")}>
                  <button type="submit" disabled={i === 0} aria-label="Naikkan" className={iconButton}>
                    ↑
                  </button>
                </form>
                <form action={moveProject.bind(null, p.id, "down")}>
                  <button
                    type="submit"
                    disabled={i === projects.length - 1}
                    aria-label="Turunkan"
                    className={iconButton}
                  >
                    ↓
                  </button>
                </form>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-medium">{p.title}</h2>
                <p className="mt-0.5 line-clamp-1 text-sm text-muted">{p.description}</p>
                {p.techList.length > 0 && (
                  <p className="mt-1 font-mono text-xs text-muted">{p.techList.join(" · ")}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/projects/${p.id}`} className={iconButton}>
                  Edit
                </Link>
                <form action={deleteProject.bind(null, p.id)}>
                  <ConfirmButton
                    message={`Hapus project "${p.title}"?`}
                    className={`${iconButton} hover:border-red-500! hover:text-red-500!`}
                  >
                    Hapus
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
