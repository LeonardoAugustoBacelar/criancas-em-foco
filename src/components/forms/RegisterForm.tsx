"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerAction, type RegisterState } from "@/lib/actions/register";

const initialState: RegisterState = {};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState
  );
  const [role, setRole] = useState<"MAE" | "PROFESSORA">("MAE");

  if (state.success) {
    return (
      <div className="rounded-2xl bg-primary-50 p-6 text-center">
        <p className="text-lg font-bold text-primary-700">
          Conta criada com sucesso!
        </p>
        <p className="mt-2 text-sm text-primary-700/80">
          Agora você já pode entrar com seu e-mail e senha.
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
      <div className="flex gap-3 rounded-full bg-primary-50 p-1">
        <button
          type="button"
          onClick={() => setRole("MAE")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
            role === "MAE"
              ? "bg-primary-500 text-white"
              : "text-primary-700"
          }`}
        >
          Sou mãe
        </button>
        <button
          type="button"
          onClick={() => setRole("PROFESSORA")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
            role === "PROFESSORA"
              ? "bg-primary-500 text-white"
              : "text-primary-700"
          }`}
        >
          Sou professora
        </button>
      </div>
      <input type="hidden" name="role" value={role} />

      <Field label="Nome completo" name="name" type="text" required />
      <Field label="E-mail" name="email" type="email" required />
      <Field label="Telefone" name="phone" type="tel" required />
      <Field label="Senha" name="password" type="password" required />

      {role === "PROFESSORA" && (
        <div className="space-y-5 rounded-2xl bg-primary-50 p-4">
          <p className="text-sm font-semibold text-primary-700">
            Conte um pouco sobre seu trabalho
          </p>
          <Field
            label="Sobre você (bio)"
            name="bio"
            type="textarea"
            required
          />
          <Field
            label="Especialidades (ex: TEA, TDAH, birras)"
            name="specialties"
            type="text"
            required
          />
          <Field
            label="WhatsApp para contato"
            name="whatsapp"
            type="tel"
            required
          />
        </div>
      )}

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
    "mt-1 w-full rounded-xl border border-primary-100 bg-white px-4 py-2.5 text-sm text-primary-700 outline-none focus:border-primary-400";

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
