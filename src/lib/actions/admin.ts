"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Não autorizado");
  }
}

export async function setTeacherApprovalAction(
  teacherId: string,
  approved: boolean
) {
  await requireAdmin();

  await prisma.teacherProfile.update({
    where: { id: teacherId },
    data: { approved },
  });

  revalidatePath("/admin");
  revalidatePath("/professoras");
  revalidatePath("/");
}

// Nega (rejeita) um pedido de conta de professora ainda pendente — apaga a
// conta inteira (o registro de User em cascata leva o TeacherProfile junto),
// já que uma conta de professora só existe pra isso. Nunca deve ser chamada
// para um perfil já aprovado.
export async function denyTeacherAction(teacherId: string) {
  await requireAdmin();

  const teacher = await prisma.teacherProfile.findUnique({
    where: { id: teacherId },
    select: { userId: true, approved: true },
  });
  if (!teacher || teacher.approved) {
    throw new Error("Só é possível negar pedidos pendentes");
  }

  await prisma.user.delete({ where: { id: teacher.userId } });

  revalidatePath("/admin");
  revalidatePath("/professoras");
  revalidatePath("/");
}

// Exclui uma reserva já cancelada, só pra limpar a tela do admin — o filtro
// por status no where garante que essa ação nunca apaga uma aula ativa
// mesmo que o id certo seja passado por engano.
export async function deleteCancelledBookingAction(bookingId: string) {
  await requireAdmin();

  await prisma.booking.deleteMany({
    where: { id: bookingId, status: "CANCELADA" },
  });

  revalidatePath("/admin");
}
