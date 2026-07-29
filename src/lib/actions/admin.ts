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
