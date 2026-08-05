"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteCancelledBookingAction } from "@/lib/actions/admin";

export default function DeleteBookingButton({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (!confirm("Excluir esta aula cancelada da lista? Essa ação não pode ser desfeita."))
          return;
        startTransition(() => {
          deleteCancelledBookingAction(bookingId);
        });
      }}
      aria-label="Excluir aula cancelada"
      className="btn-press flex h-8 w-8 items-center justify-center rounded-md text-primary-700/50 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
