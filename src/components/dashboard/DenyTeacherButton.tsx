"use client";

import { useTransition } from "react";
import { denyTeacherAction } from "@/lib/actions/admin";

export default function DenyTeacherButton({ teacherId }: { teacherId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (
          !confirm(
            "Tem certeza que deseja negar e excluir este pedido de conta de professora? Essa ação não pode ser desfeita."
          )
        )
          return;
        startTransition(() => {
          denyTeacherAction(teacherId);
        });
      }}
      className="btn-press rounded-md border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {isPending ? "Negando..." : "Negar"}
    </button>
  );
}
