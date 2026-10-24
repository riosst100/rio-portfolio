import type { Metadata } from "next";
import { LoginForm } from "../_components/LoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8">
        <p className="font-mono text-sm text-accent">~/admin</p>
        <h1 className="mt-1 mb-6 text-xl font-semibold">Masuk ke dashboard</h1>
        <LoginForm />
      </div>
    </main>
  );
}
