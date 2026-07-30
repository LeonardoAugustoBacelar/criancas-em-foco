"use client";

import { useActionState, useTransition } from "react";
import {
  addAvailabilityAction,
  deleteAvailabilityAction,
  type AvailabilityState,
} from "@/lib/actions/availability";

const WEEKDAY_LABELS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

const initialState: AvailabilityState = {};

export default function AvailabilityManager({
  availabilities,
}: {
  availabilities: { id: string; weekday: number; startTime: string; endTime: string }[];
}) {
  const [state, formAction, isPending] = useActionState(
    addAvailabilityAction,
    initialState
  );
  const [isDeleting, startDeleteTransition] = useTransition();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {availabilities.length === 0 && (
          <p className="text-sm text-primary-700/70">
            Nenhum horário cadastrado ainda.
          </p>
        )}
        {availabilities
          .slice()
          .sort((a, b) => a.weekday - b.weekday || a.startTime.localeCompare(b.startTime))
          .map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between rounded-md bg-primary-50 px-4 py-2 text-sm"
            >
              <span className="text-primary-700">
                {WEEKDAY_LABELS[slot.weekday]}: {slot.startTime} às {slot.endTime}
              </span>
              <button
                disabled={isDeleting}
                onClick={() =>
                  startDeleteTransition(() => {
                    deleteAvailabilityAction(slot.id);
                  })
                }
                className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
              >
                Remover
              </button>
            </div>
          ))}
      </div>

      <form action={formAction} className="flex flex-wrap items-end gap-3">
        <label className="text-sm font-medium text-primary-700">
          Dia da semana
          <select
            name="weekday"
            className="mt-1 block rounded-md border border-primary-100 bg-white px-3 py-2 text-sm text-primary-700"
          >
            {WEEKDAY_LABELS.map((label, index) => (
              <option key={label} value={index}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-primary-700">
          Início
          <input
            type="time"
            name="startTime"
            required
            className="mt-1 block rounded-md border border-primary-100 bg-white px-3 py-2 text-sm text-primary-700"
          />
        </label>

        <label className="text-sm font-medium text-primary-700">
          Fim
          <input
            type="time"
            name="endTime"
            required
            className="mt-1 block rounded-md border border-primary-100 bg-white px-3 py-2 text-sm text-primary-700"
          />
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
        >
          {isPending ? "Adicionando..." : "Adicionar horário"}
        </button>
      </form>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}
    </div>
  );
}
