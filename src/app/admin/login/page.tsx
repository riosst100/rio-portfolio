import type { Metadata } from "next";
import { connection } from "next/server";
import { LoginForm } from "../_components/LoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default async function LoginPage() {
  // Read env per request so the password is never baked into build output.
  await connection();
  const prefill =
    process.env.LOGIN_PREFILL === "true" ? process.env.ADMIN_PASSWORD : undefined;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8">
        <p className="font-mono text-sm text-accent">~/admin</p>
        <h1 className="mt-1 mb-6 text-xl font-semibold">Masuk ke dashboard</h1>
        {prefill && (
          <p className="mb-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
            Mode testing: password terisi otomatis. Matikan <code>LOGIN_PREFILL</code> di production.
          </p>
        )}
        <LoginForm defaultPassword={prefill} />
      </div>
    </main>
  );
}
