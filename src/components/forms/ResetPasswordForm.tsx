"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  resetPasswordAction,
  type ResetPasswordState,
} from "@/lib/actions/passwordReset";

const initialState: ResetPasswordState = {};

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialState
  );

  if (state.success) {
    return (
      <div className="rounded-2xl bg-primary-50 p-6 text-center">
        <p className="font-bold text-primary-700">Senha atualizada!</p>
        <p className="mt-2 text-sm text-primary-700/80">
          Agora você já pode entrar com a sua nova senha.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-full bg-accent-500 px-6 py-2.5 font-semibold text-white hover:bg-accent-600"
        >
          Ir para o login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="token" value={token} />

      <label className="block text-sm font-medium text-primary-700">
        Nova senha
        <input
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-xl border border-primary-100 bg-white px-4 py-2.5 text-sm text-primary-700 outline-none focus:border-primary-400"
        />
      </label>

      <label className="block text-sm font-medium text-primary-700">
        Confirmar nova senha
        <input
          name="confirmPassword"
          type="password"
          required
          className="mt-1 w-full rounded-xl border border-primary-100 bg-white px-4 py-2.5 text-sm text-primary-700 outline-none focus:border-primary-400"
        />
      </label>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-accent-500 px-6 py-3 font-semibold text-white transition hover:bg-accent-600 disabled:opacity-60"
      >
        {isPending ? "Salvando..." : "Salvar nova senha"}
      </button>
    </form>
  );
}
