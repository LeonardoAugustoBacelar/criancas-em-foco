"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type LoginState } from "@/lib/actions/login";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <label className="block text-sm font-medium text-primary-700">
        E-mail
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-md border border-primary-100 bg-white px-4 py-2.5 text-sm text-primary-700 outline-none focus:border-primary-400"
        />
      </label>

      <label className="block text-sm font-medium text-primary-700">
        Senha
        <input
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-md border border-primary-100 bg-white px-4 py-2.5 text-sm text-primary-700 outline-none focus:border-primary-400"
        />
      </label>

      <p className="text-right text-sm">
        <Link
          href="/esqueci-senha"
          className="font-semibold text-accent-600 hover:underline"
        >
          Esqueci minha senha
        </Link>
      </p>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="btn-press w-full rounded-md bg-accent-500 px-6 py-3 font-semibold text-white hover:bg-accent-600 disabled:opacity-60"
      >
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
