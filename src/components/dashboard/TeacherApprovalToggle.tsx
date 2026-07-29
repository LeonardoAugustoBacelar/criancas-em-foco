"use client";

import { useTransition } from "react";
import { setTeacherApprovalAction } from "@/lib/actions/admin";

export default function TeacherApprovalToggle({
  teacherId,
  approved,
}: {
  teacherId: string;
  approved: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(() => {
          setTeacherApprovalAction(teacherId, !approved);
        })
      }
      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
        approved
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-primary-500 text-white hover:bg-primary-600"
      }`}
    >
      {isPending ? "Salvando..." : approved ? "Suspender" : "Aprovar"}
    </button>
  );
}
