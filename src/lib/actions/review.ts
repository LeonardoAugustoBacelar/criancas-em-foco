"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ReviewState = {
  error?: string;
  success?: boolean;
};

const reviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export async function createReviewAction(
  _prevState: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "MAE") {
    return { error: "Você precisa entrar com uma conta de mãe para avaliar." };
  }

  const parsed = reviewSchema.safeParse({
    bookingId: formData.get("bookingId"),
    rating: formData.get("rating"),
    comment: formData.get("comment") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { bookingId, rating, comment } = parsed.data;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { review: true },
  });

  if (!booking || booking.maeId !== session.user.id) {
    return { error: "Aula não encontrada." };
  }

  if (booking.status !== "CONCLUIDA") {
    return { error: "Só é possível avaliar aulas já concluídas." };
  }

  if (booking.review) {
    return { error: "Você já avaliou esta aula." };
  }

  await prisma.review.create({
    data: {
      bookingId: booking.id,
      maeId: session.user.id,
      teacherId: booking.teacherId,
      rating,
      comment,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/professoras/${booking.teacherId}`);
  revalidatePath("/professoras");

  return { success: true };
}
