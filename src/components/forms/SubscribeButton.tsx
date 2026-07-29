"use client";

import { useActionState } from "react";
import {
  createSubscriptionCheckoutAction,
  type SubscriptionState,
} from "@/lib/actions/subscription";

const initialState: SubscriptionState = {};

export default function SubscribeButton({
  planId,
  label = "Assinar este plano",
}: {
  planId: string;
  label?: string;
}) {
  const [state, formAction, isPending] = useActionState(
    createSubscriptionCheckoutAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="planId" value={planId} />
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-accent-500 px-6 py-3 font-semibold text-white transition hover:bg-accent-600 disabled:opacity-60"
      >
        {isPending ? "Redirecionando..." : label}
      </button>
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}
    </form>
  );
}
