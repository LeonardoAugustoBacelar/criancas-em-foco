"use client";

import { useState, useTransition } from "react";
import { addTeacherNoteAction } from "@/lib/actions/booking";

export default function TeacherNoteForm({ bookingId }: { bookingId: string }) {
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const save = () => {
    setError(null);
    startTransition(async () => {
      try {
        await addTeacherNoteAction(bookingId, note);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Não foi possível salvar.");
      }
    });
  };

  return (
    <div className="mt-3 space-y-2 rounded-md bg-primary-50/60 p-3">
      <label className="block text-xs font-semibold text-primary-700/70">
        Nota da aula (a mãe vê isso no painel dela)
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="O que vocês trabalharam? Algum combinado pra próxima aula?"
          className="mt-1 w-full rounded-md border border-primary-100 bg-white px-3 py-2 text-sm text-primary-700 outline-none focus:border-primary-400"
        />
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={isPending || note.trim().length === 0}
          onClick={save}
          className="rounded-md bg-primary-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
        >
          {isPending ? "Salvando..." : "Salvar nota"}
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    </div>
  );
}
