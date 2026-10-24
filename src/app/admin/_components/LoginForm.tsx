"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { inputClass, primaryButton } from "./styles";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className={inputClass}
        />
      </div>
      {state?.message && (
        <p className="text-sm text-red-500" role="alert">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${primaryButton} w-full`}>
        {pending ? "Masuk…" : "Masuk"}
      </button>
    </form>
  );
}
