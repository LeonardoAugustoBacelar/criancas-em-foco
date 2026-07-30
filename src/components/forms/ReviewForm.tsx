"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { createReviewAction, type ReviewState } from "@/lib/actions/review";

const initialState: ReviewState = {};

export default function ReviewForm({ bookingId }: { bookingId: string }) {
  const [state, formAction, isPending] = useActionState(
    createReviewAction,
    initialState
  );
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  if (state.success) {
    return (
      <p className="rounded-md bg-primary-50 px-3 py-2 text-xs font-medium text-primary-700">
        Obrigada pela avaliação!
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-2 rounded-md border border-primary-100 p-3">
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="rating" value={rating} />

      <p className="text-xs font-semibold text-primary-700">
        Como foi essa aula?
      </p>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`${value} estrela(s)`}
            onClick={() => setRating(value)}
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
            className="btn-press p-0.5"
          >
            <Star
              className={`h-5 w-5 ${
                value <= (hoverRating || rating)
                  ? "fill-accent-500 text-accent-500"
                  : "text-primary-100"
              }`}
            />
          </button>
        ))}
      </div>

      <textarea
        name="comment"
        rows={2}
        placeholder="Conte como foi (opcional)"
        className="w-full rounded-md border border-primary-100 bg-white px-3 py-2 text-xs text-primary-700 outline-none focus:border-primary-400"
      />

      {state.error && (
        <p className="text-xs text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending || rating === 0}
        className="btn-press rounded-md bg-accent-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-accent-600 disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Enviar avaliação"}
      </button>
    </form>
  );
}
