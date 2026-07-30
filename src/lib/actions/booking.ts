"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type BookingState = {
  error?: string;
  success?: boolean;
};

const bookingSchema = z.object({
  teacherId: z.string().min(1),
  childName: z.string().min(2, "Informe o nome da criança"),
  date: z.string().min(1, "Escolha uma data"),
  startTime: z.string().min(1, "Escolha um horário"),
  endTime: z.string().min(1),
  notes: z.string().optional(),
});

export async function createBookingAction(
  _prevState: BookingState,
  formData: FormData
): Promise<BookingState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "MAE") {
    return { error: "Você precisa entrar com uma conta de mãe para agendar." };
  }

  const subscription = await prisma.subscription.findUnique({
    where: { maeId: session.user.id },
    include: { plan: true },
  });

  if (subscription?.status !== "ATIVA") {
    return {
      error: "Você precisa de uma assinatura ativa para agendar aulas. Veja os planos disponíveis.",
    };
  }

  if (subscription.plan.aulasPerMes) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const bookingsThisMonth = await prisma.booking.count({
      where: {
        maeId: session.user.id,
        date: { gte: startOfMonth, lt: startOfNextMonth },
        status: { in: ["PENDENTE", "CONFIRMADA", "CONCLUIDA"] },
      },
    });

    if (bookingsThisMonth >= subscription.plan.aulasPerMes) {
      return {
        error: `Você já usou as ${subscription.plan.aulasPerMes} aulas incluídas no seu plano este mês.`,
      };
    }
  }

  const parsed = bookingSchema.safeParse({
    teacherId: formData.get("teacherId"),
    childName: formData.get("childName"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const data = parsed.data;

  const conflict = await prisma.booking.findFirst({
    where: {
      teacherId: data.teacherId,
      date: new Date(data.date),
      startTime: data.startTime,
      status: { in: ["PENDENTE", "CONFIRMADA"] },
    },
  });

  if (conflict) {
    return { error: "Esse horário já está reservado. Escolha outro." };
  }

  await prisma.booking.create({
    data: {
      maeId: session.user.id,
      teacherId: data.teacherId,
      childName: data.childName,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      notes: data.notes,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function cancelOwnBookingAction(bookingId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "MAE") {
    throw new Error("Não autorizado");
  }

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

  if (!booking || booking.maeId !== session.user.id) {
    throw new Error("Não autorizado");
  }

  if (booking.status !== "PENDENTE" && booking.status !== "CONFIRMADA") {
    throw new Error("Esta aula não pode mais ser cancelada.");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELADA" },
  });

  revalidatePath("/dashboard");
}

export async function updateBookingStatusAction(
  bookingId: string,
  status: "CONFIRMADA" | "CANCELADA" | "CONCLUIDA"
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PROFESSORA") {
    throw new Error("Não autorizado");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { teacher: true },
  });

  if (!booking || booking.teacher.userId !== session.user.id) {
    throw new Error("Não autorizado");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  revalidatePath("/dashboard");
}
