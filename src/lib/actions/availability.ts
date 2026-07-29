"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type AvailabilityState = {
  error?: string;
};

const availabilitySchema = z.object({
  weekday: z.coerce.number().min(0).max(6),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
});

async function requireTeacherProfile() {
  const session = await auth();
  if (!session?.user || session.user.role !== "PROFESSORA") {
    throw new Error("Não autorizado");
  }

  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!teacherProfile) {
    throw new Error("Perfil de professora não encontrado");
  }

  return teacherProfile;
}

export async function addAvailabilityAction(
  _prevState: AvailabilityState,
  formData: FormData
): Promise<AvailabilityState> {
  const teacherProfile = await requireTeacherProfile();

  const parsed = availabilitySchema.safeParse({
    weekday: formData.get("weekday"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  if (parsed.data.startTime >= parsed.data.endTime) {
    return { error: "O horário final precisa ser depois do inicial" };
  }

  await prisma.availability.create({
    data: {
      teacherId: teacherProfile.id,
      weekday: parsed.data.weekday,
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
    },
  });

  revalidatePath("/dashboard");
  return {};
}

export async function deleteAvailabilityAction(availabilityId: string) {
  const teacherProfile = await requireTeacherProfile();

  await prisma.availability.deleteMany({
    where: { id: availabilityId, teacherId: teacherProfile.id },
  });

  revalidatePath("/dashboard");
}
