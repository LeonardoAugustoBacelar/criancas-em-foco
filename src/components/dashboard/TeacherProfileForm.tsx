"use client";

import { useActionState } from "react";
import {
  updateTeacherProfileAction,
  type TeacherProfileState,
} from "@/lib/actions/teacherProfile";

const initialState: TeacherProfileState = {};

export default function TeacherProfileForm({
  bio,
  specialties,
  whatsapp,
  pricePerHour,
  photoUrl,
}: {
  bio: string;
  specialties: string;
  whatsapp: string;
  pricePerHour: number;
  photoUrl: string | null;
}) {
  const [state, formAction, isPending] = useActionState(
    updateTeacherProfileAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm font-medium text-primary-700">
        Sobre você (bio)
        <textarea
          name="bio"
          defaultValue={bio}
          rows={4}
          required
          className="mt-1 w-full rounded-xl border border-primary-100 bg-white px-4 py-2.5 text-sm text-primary-700 outline-none focus:border-primary-400"
        />
      </label>

      <label className="block text-sm font-medium text-primary-700">
        Especialidades
        <input
          name="specialties"
          defaultValue={specialties}
          required
          className="mt-1 w-full rounded-xl border border-primary-100 bg-white px-4 py-2.5 text-sm text-primary-700 outline-none focus:border-primary-400"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-primary-700">
          WhatsApp
          <input
            name="whatsapp"
            defaultValue={whatsapp}
            required
            className="mt-1 w-full rounded-xl border border-primary-100 bg-white px-4 py-2.5 text-sm text-primary-700 outline-none focus:border-primary-400"
          />
        </label>

        <label className="block text-sm font-medium text-primary-700">
          Preço por hora (R$)
          <input
            name="pricePerHour"
            type="number"
            min={0}
            step="0.01"
            defaultValue={pricePerHour}
            className="mt-1 w-full rounded-xl border border-primary-100 bg-white px-4 py-2.5 text-sm text-primary-700 outline-none focus:border-primary-400"
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-primary-700">
        URL da foto de perfil (opcional)
        <input
          name="photoUrl"
          type="url"
          placeholder="https://..."
          defaultValue={photoUrl ?? ""}
          className="mt-1 w-full rounded-xl border border-primary-100 bg-white px-4 py-2.5 text-sm text-primary-700 outline-none focus:border-primary-400"
        />
        <span className="mt-1 block text-xs text-primary-700/60">
          Cole o link de uma foto hospedada (ex: Google Drive público, Imgur).
        </span>
      </label>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          Perfil atualizado com sucesso!
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:opacity-60"
      >
        {isPending ? "Salvando..." : "Salvar perfil"}
      </button>
    </form>
  );
}
