"use client";

import { useTransition } from "react";
import { cancelSubscriptionAction } from "@/lib/actions/subscription";

export default function CancelSubscriptionButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (!confirm("Tem certeza que deseja cancelar sua assinatura?")) return;
        startTransition(() => {
          cancelSubscriptionAction();
        });
      }}
      className="rounded-md border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {isPending ? "Cancelando..." : "Cancelar assinatura"}
    </button>
  );
}
