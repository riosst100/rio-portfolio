import type { Metadata } from "next";
import Link from "next/link";
import { verifySession } from "@/lib/session";
import { logout } from "../actions";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: { index: false },
};

const nav = [
  { href: "/admin", label: "Portfolio" },
  { href: "/admin/contact", label: "Kontak" },
];

export default async function DashboardLayout({ children }: LayoutProps<"/admin">) {
  await verifySession();

  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-mono text-sm font-semibold">
              <span className="text-accent">~/</span>admin
            </Link>
            <nav className="flex gap-4 text-sm text-muted">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-foreground">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" target="_blank" className="hidden text-muted hover:text-foreground sm:inline">
              Lihat situs ↗
            </Link>
            <form action={logout}>
              <button type="submit" className="text-muted hover:text-foreground">
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">{children}</main>
    </>
  );
}
