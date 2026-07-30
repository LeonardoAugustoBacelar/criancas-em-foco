"use client";

import { useActionState, useMemo, useState } from "react";
import { createBookingAction, type BookingState } from "@/lib/actions/booking";

const WEEKDAY_LABELS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

const initialState: BookingState = {};

export default function BookingForm({
  teacherId,
  availabilities,
  bookedSlots = [],
}: {
  teacherId: string;
  availabilities: { id: string; weekday: number; startTime: string; endTime: string }[];
  bookedSlots?: { date: string; startTime: string }[];
}) {
  const [state, formAction, isPending] = useActionState(
    createBookingAction,
    initialState
  );
  const [date, setDate] = useState("");

  const weekdayOfDate = date ? new Date(`${date}T00:00:00`).getDay() : null;

  const takenTimesForDate = useMemo(
    () =>
      new Set(
        bookedSlots.filter((b) => b.date === date).map((b) => b.startTime)
      ),
    [bookedSlots, date]
  );

  const slotsForDay = useMemo(
    () =>
      weekdayOfDate === null
        ? []
        : availabilities
            .filter((a) => a.weekday === weekdayOfDate)
            .map((a) => ({ ...a, taken: takenTimesForDate.has(a.startTime) })),
    [availabilities, weekdayOfDate, takenTimesForDate]
  );

  const availableSlotsForDay = slotsForDay.filter((s) => !s.taken);

  if (state.success) {
    return (
      <div className="rounded-lg border border-primary-100 bg-primary-50 p-6 text-center">
        <p className="font-bold text-primary-700">
          Solicitação de aula enviada!
        </p>
        <p className="mt-2 text-sm text-primary-700/80">
          A professora vai confirmar o horário em breve. Acompanhe em
          &quot;Minha área&quot;.
        </p>
      </div>
    );
  }

  if (availabilities.length === 0) {
    return (
      <p className="rounded-lg border border-primary-100 bg-primary-50 p-4 text-sm text-primary-700/80">
        Esta professora ainda não cadastrou horários disponíveis. Fale com
        ela pelo WhatsApp para combinar um horário.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="teacherId" value={teacherId} />

      <div className="rounded-md bg-primary-50 p-3 text-xs text-primary-700/80">
        <p className="font-semibold text-primary-700">Dias disponíveis:</p>
        <p className="mt-1">
          {[...new Set(availabilities.map((a) => a.weekday))]
            .sort()
            .map((w) => WEEKDAY_LABELS[w])
            .join(", ")}
        </p>
      </div>

      <label className="block text-sm font-medium text-primary-700">
        Nome da criança
        <input
          name="childName"
          required
          className="mt-1 w-full rounded-md border border-primary-100 bg-white px-4 py-2.5 text-sm text-primary-700 outline-none focus:border-primary-400"
        />
      </label>

      <label className="block text-sm font-medium text-primary-700">
        Data da aula
        <input
          name="date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 w-full rounded-md border border-primary-100 bg-white px-4 py-2.5 text-sm text-primary-700 outline-none focus:border-primary-400"
        />
      </label>

      {date && slotsForDay.length === 0 && (
        <p className="text-sm text-accent-600">
          A professora não atende em {WEEKDAY_LABELS[weekdayOfDate!]}s.
          Escolha outra data.
        </p>
      )}

      {date && slotsForDay.length > 0 && availableSlotsForDay.length === 0 && (
        <p className="text-sm text-accent-600">
          Todos os horários desse dia já estão reservados. Escolha outra data.
        </p>
      )}

      {slotsForDay.length > 0 && (
        <label className="block text-sm font-medium text-primary-700">
          Horário
          <select
            name="slot"
            required
            className="mt-1 w-full rounded-md border border-primary-100 bg-white px-4 py-2.5 text-sm text-primary-700 outline-none focus:border-primary-400"
            onChange={(e) => {
              const [start, end] = e.target.value.split("|");
              const form = e.target.closest("form")!;
              (form.elements.namedItem("startTime") as HTMLInputElement).value = start;
              (form.elements.namedItem("endTime") as HTMLInputElement).value = end;
            }}
          >
            <option value="">Selecione...</option>
            {slotsForDay.map((slot) => (
              <option
                key={slot.id}
                value={`${slot.startTime}|${slot.endTime}`}
                disabled={slot.taken}
              >
                {slot.startTime} às {slot.endTime}
                {slot.taken ? " (indisponível)" : ""}
              </option>
            ))}
          </select>
        </label>
      )}
      <input type="hidden" name="startTime" />
      <input type="hidden" name="endTime" />

      <label className="block text-sm font-medium text-primary-700">
        Observações (opcional)
        <textarea
          name="notes"
          rows={3}
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
        disabled={isPending || availableSlotsForDay.length === 0}
        className="btn-press w-full rounded-md bg-accent-500 px-6 py-3 font-semibold text-white hover:bg-accent-600 disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Solicitar aula"}
      </button>
    </form>
  );
}
