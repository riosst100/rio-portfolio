import { verifySession } from "@/lib/session";
import { createProject } from "../../../actions";
import { ProjectForm } from "../../../_components/ProjectForm";

export default async function NewProjectPage() {
  await verifySession();

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Tambah project</h1>
      <div className="rounded-lg border border-border bg-card p-6">
        <ProjectForm action={createProject} />
      </div>
    </>
  );
}
