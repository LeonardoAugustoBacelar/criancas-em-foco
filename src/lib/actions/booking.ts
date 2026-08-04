"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidSlot, SCHEDULE_RULES } from "@/lib/schedule";

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
  const bookingDate = new Date(data.date);

  if (!isValidSlot(bookingDate, data.startTime, data.endTime)) {
    return { error: "Horário inválido. Escolha um dos horários disponíveis." };
  }

  const blockedDate = await prisma.blockedDate.findUnique({
    where: { teacherId_date: { teacherId: data.teacherId, date: bookingDate } },
  });

  if (blockedDate) {
    return { error: "A professora não está disponível nesse dia. Escolha outra data." };
  }

  const conflict = await prisma.booking.findFirst({
    where: {
      teacherId: data.teacherId,
      date: bookingDate,
      startTime: data.startTime,
      status: { in: ["PENDENTE", "CONFIRMADA"] },
    },
  });

  if (conflict) {
    return { error: "Esse horário já está reservado. Escolha outro." };
  }

  const bookingsThisDay = await prisma.booking.count({
    where: {
      teacherId: data.teacherId,
      date: bookingDate,
      status: { in: ["PENDENTE", "CONFIRMADA"] },
    },
  });

  if (bookingsThisDay >= SCHEDULE_RULES.maxBookingsPerDay) {
    return {
      error: `Esse dia já atingiu o limite de ${SCHEDULE_RULES.maxBookingsPerDay} aulas. Escolha outro dia.`,
    };
  }

  await prisma.booking.create({
    data: {
      maeId: session.user.id,
      teacherId: data.teacherId,
      childName: data.childName,
      date: bookingDate,
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

export async function addTeacherNoteAction(bookingId: string, note: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "PROFESSORA") {
    throw new Error("Não autorizado");
  }

  const trimmed = note.trim();
  if (trimmed.length === 0) {
    throw new Error("A nota não pode ficar vazia.");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { teacher: true },
  });

  if (!booking || booking.teacher.userId !== session.user.id) {
    throw new Error("Não autorizado");
  }

  if (booking.status !== "CONCLUIDA") {
    throw new Error("Só é possível anotar aulas já concluídas.");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { teacherNote: trimmed },
  });

  revalidatePath("/dashboard");
}
