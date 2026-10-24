import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { updateProject } from "../../../actions";
import { ProjectForm } from "../../../_components/ProjectForm";

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  await verifySession();
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Edit project</h1>
      <div className="rounded-lg border border-border bg-card p-6">
        <ProjectForm action={updateProject.bind(null, project.id)} project={project} />
      </div>
    </>
  );
}
