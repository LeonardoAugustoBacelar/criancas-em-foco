"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type RegisterState } from "@/lib/actions/register";

const initialState: RegisterState = {};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState
  );

  if (state.success) {
    return (
      <div className="rounded-lg border border-primary-100 bg-primary-50 p-6 text-center">
        <p className="text-lg font-bold text-primary-700">
          Conta criada com sucesso!
        </p>
        <p className="mt-2 text-sm text-primary-700/80">
          Agora você já pode entrar com seu e-mail e senha.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-md bg-accent-500 px-6 py-2.5 font-semibold text-white hover:bg-accent-600"
        >
          Ir para o login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Nome completo" name="name" type="text" required />
      <Field label="E-mail" name="email" type="email" required />
      <Field label="Telefone" name="phone" type="tel" required />
      <Field label="Senha" name="password" type="password" required />

      <label className="flex items-start gap-2 text-xs text-primary-700/80">
        <input
          type="checkbox"
          name="acceptedTerms"
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-primary-300"
        />
        <span>
          Li e aceito os{" "}
          <Link href="/termos" target="_blank" className="font-semibold underline">
            Termos de Uso
          </Link>{" "}
          e a{" "}
          <Link href="/privacidade" target="_blank" className="font-semibold underline">
            Política de Privacidade
          </Link>
          .
        </span>
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
        {isPending ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  required,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}) {
  const baseClass =
    "mt-1 w-full rounded-md border border-primary-100 bg-white px-4 py-2.5 text-sm text-primary-700 outline-none focus:border-primary-400";

  return (
    <label className="block text-sm font-medium text-primary-700">
      {label}
      {type === "textarea" ? (
        <textarea name={name} required={required} rows={3} className={baseClass} />
      ) : (
        <input name={name} type={type} required={required} className={baseClass} />
      )}
    </label>
  );
}
