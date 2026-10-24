-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tech" TEXT NOT NULL DEFAULT '',
    "href" TEXT,
    "repo" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "message" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- Seed: initial portfolio content (edit later from /admin)
INSERT INTO "Contact" ("id", "email", "phone", "location", "message", "updatedAt") VALUES
  (1, 'rio@example.com', NULL, 'Indonesia', 'I''m open to new opportunities and collaborations. Whether you have a project in mind or just want to say hi, my inbox is always open.', CURRENT_TIMESTAMP);

INSERT INTO "SocialLink" ("id", "label", "href", "order") VALUES
  ('seed-github', 'GitHub', 'https://github.com/', 0),
  ('seed-linkedin', 'LinkedIn', 'https://www.linkedin.com/', 1);

INSERT INTO "Project" ("id", "title", "description", "tech", "href", "repo", "order", "createdAt", "updatedAt") VALUES
  ('seed-tcg', 'TCG Collectors Platform', 'Marketplace and catalogue for trading card game collectors, backed by a PIM system for product data and a dedicated admin panel.', 'Laravel, Next.js, MySQL, Redis, Docker', NULL, NULL, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('seed-roadmap', 'Roadmap Projects', 'A lightweight roadmap tool to plan projects and track items by status, with shareable project pages.', 'Next.js, Prisma, SQLite, Tailwind', NULL, NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('seed-consultant', 'Consultant Booking Site', 'Website for a consulting service with content pages and a booking flow, built on the Next.js App Router.', 'Next.js, TypeScript, Prisma', NULL, NULL, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
