import { connection } from "next/server";
import { experiences, profile, skills } from "@/data/profile";
import { getContact, getProjects, getSocials } from "@/lib/content";

const nav = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 py-16 sm:py-20">
      <h2 className="mb-8 flex items-baseline gap-3 text-2xl font-semibold tracking-tight">
        <span className="font-mono text-sm text-accent">{index}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted">
      {children}
    </span>
  );
}

export default async function Home() {
  // Content is edited from /admin, so render per request instead of at build time.
  await connection();
  const [projects, contact, socials] = await Promise.all([
    getProjects(),
    getContact(),
    getSocials(),
  ]);

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <a href="#" className="font-mono text-sm font-semibold">
            <span className="text-accent">~/</span>
            {profile.name.toLowerCase()}
          </a>
          <nav className="hidden gap-6 text-sm text-muted sm:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-6">
        <section className="flex min-h-[calc(100svh-3.5rem)] flex-col justify-center py-20">
          <p className="font-mono text-sm text-accent">Hi, my name is</p>
          <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-7xl">
            {profile.name}.
          </h1>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-muted sm:text-5xl">
            {profile.role}
          </p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {profile.tagline}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-md bg-accent px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              View my work
            </a>
            <a
              href="#contact"
              className="rounded-md border border-border px-5 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
            >
              Get in touch
            </a>
          </div>
        </section>

        <Section id="about" index="01." title="About me">
          <div className="max-w-2xl space-y-4 leading-relaxed text-muted">
            {profile.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Section>

        <Section id="skills" index="02." title="Skills">
          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map((s) => (
              <div
                key={s.group}
                className="rounded-lg border border-border bg-card p-5"
              >
                <h3 className="mb-4 text-sm font-semibold">{s.group}</h3>
                <div className="flex flex-wrap gap-2">
                  {s.items.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="experience" index="03." title="Experience">
          <ol className="space-y-10 border-l border-border pl-6">
            {experiences.map((e) => (
              <li key={e.company + e.period} className="relative">
                <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
                <p className="font-mono text-xs text-muted">{e.period}</p>
                <h3 className="mt-1 font-semibold">
                  {e.role} <span className="text-accent">@ {e.company}</span>
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
                  {e.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-accent">▹</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="projects" index="04." title="Projects">
          {projects.length === 0 && (
            <p className="text-muted">Projects coming soon.</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <article
                key={p.id}
                className="flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-accent"
              >
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {p.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.techList.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                {(p.href || p.repo) && (
                  <div className="mt-5 flex gap-4 text-sm">
                    {p.href && (
                      <a href={p.href} className="text-accent hover:underline">
                        Live ↗
                      </a>
                    )}
                    {p.repo && (
                      <a href={p.repo} className="text-accent hover:underline">
                        Source ↗
                      </a>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </Section>

        <Section id="contact" index="05." title="Get in touch">
          {contact.message && (
            <p className="max-w-xl leading-relaxed text-muted">
              {contact.message}
            </p>
          )}
          {(contact.phone || contact.location) && (
            <dl className="mt-6 space-y-1 font-mono text-sm text-muted">
              {contact.phone && (
                <div>
                  <dt className="inline text-accent">phone: </dt>
                  <dd className="inline">{contact.phone}</dd>
                </div>
              )}
              {contact.location && (
                <div>
                  <dt className="inline text-accent">location: </dt>
                  <dd className="inline">{contact.location}</dd>
                </div>
              )}
            </dl>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="rounded-md bg-accent px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                {contact.email}
              </a>
            )}
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-border px-5 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
              >
                {s.label}
              </a>
            ))}
          </div>
        </Section>
      </main>

      <footer className="border-t border-border py-8 text-center font-mono text-xs text-muted">
        © {new Date().getFullYear()} {profile.name}. Built with Next.js.
      </footer>
    </>
  );
}
