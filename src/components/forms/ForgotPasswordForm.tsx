"use client";

import { useActionState } from "react";
import {
  requestPasswordResetAction,
  type RequestResetState,
} from "@/lib/actions/passwordReset";

const initialState: RequestResetState = {};

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordResetAction,
    initialState
  );

  if (state.message) {
    return (
      <div className="rounded-lg border border-primary-100 bg-primary-50 p-6 text-center text-sm text-primary-700">
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <label className="block text-sm font-medium text-primary-700">
        E-mail cadastrado
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-md border border-primary-100 bg-white px-4 py-2.5 text-sm text-primary-700 outline-none focus:border-primary-400"
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
        className="btn-press w-full rounded-md bg-accent-500 px-6 py-3 font-semibold text-white hover:bg-accent-600 disabled:opacity-60"
      >
        {isPending ? "Enviando..." : "Enviar link de redefinição"}
      </button>
    </form>
  );
}
