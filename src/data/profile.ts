// Konten statis website. Project dan info kontak dikelola lewat /admin (database).

export const profile = {
  name: "Rio",
  role: "Software Engineer",
  tagline:
    "I build reliable web applications and backend systems — from database schema to pixel-perfect UI.",
  about: [
    "I'm a software engineer focused on building products that are fast, maintainable, and pleasant to use. I enjoy working across the stack: designing APIs, modelling data, and crafting interfaces.",
    "Lately I've been working with Next.js, Laravel, and containerized deployments with Docker. I care about clean architecture, good developer experience, and shipping things that actually solve problems.",
  ],
};

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Frontend",
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Vue"],
  },
  {
    group: "Backend",
    items: ["Node.js", "PHP", "Laravel", "REST API", "WebSocket"],
  },
  {
    group: "Database",
    items: ["PostgreSQL", "MySQL", "Redis", "Prisma", "SQLite"],
  },
  {
    group: "DevOps & Tools",
    items: ["Docker", "Linux", "Git", "Nginx", "CI/CD"],
  },
];

export const experiences: {
  company: string;
  role: string;
  period: string;
  points: string[];
}[] = [
  {
    company: "Inovasi Online",
    role: "Full-Stack Developer",
    period: "2024 — Present",
    points: [
      "Built a multi-app platform (backend API, admin panel, customer frontend) with Laravel and Next.js.",
      "Containerized the whole stack with Docker Compose for consistent local and production environments.",
      "Implemented real-time features using WebSocket (Laravel Reverb) and Redis queues.",
    ],
  },
  {
    company: "Freelance",
    role: "Web Developer",
    period: "2022 — 2024",
    points: [
      "Delivered company profiles, dashboards, and internal tools for small businesses.",
      "Worked directly with clients from requirement gathering to deployment.",
    ],
  },
];
