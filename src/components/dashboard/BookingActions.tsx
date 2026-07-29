"use client";

import { useTransition } from "react";
import { updateBookingStatusAction } from "@/lib/actions/booking";

export default function BookingActions({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();

  const act = (status: "CONFIRMADA" | "CANCELADA" | "CONCLUIDA") => {
    startTransition(() => {
      updateBookingStatusAction(bookingId, status);
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        disabled={isPending}
        onClick={() => act("CONFIRMADA")}
        className="rounded-full bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
      >
        Confirmar
      </button>
      <button
        disabled={isPending}
        onClick={() => act("CONCLUIDA")}
        className="rounded-full bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-200 disabled:opacity-50"
      >
        Concluir
      </button>
      <button
        disabled={isPending}
        onClick={() => act("CANCELADA")}
        className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
      >
        Cancelar
      </button>
    </div>
  );
}
