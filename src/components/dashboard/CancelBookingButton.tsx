"use client";

import { useTransition } from "react";
import { cancelOwnBookingAction } from "@/lib/actions/booking";

export default function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (!confirm("Tem certeza que deseja cancelar esta aula?")) return;
        startTransition(() => {
          cancelOwnBookingAction(bookingId);
        });
      }}
      className="btn-press rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
    >
      {isPending ? "Cancelando..." : "Cancelar aula"}
    </button>
  );
}
