"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type TeacherProfileState = {
  error?: string;
  success?: boolean;
};

const profileSchema = z.object({
  bio: z.string().min(10, "Conte um pouco mais sobre você"),
  specialties: z.string().min(3, "Informe suas especialidades"),
  credentials: z.string().trim().optional(),
  whatsapp: z.string().min(8, "Informe um WhatsApp válido"),
  pricePerHour: z.coerce.number().min(0),
  photoUrl: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^https?:\/\//.test(value), {
      message: "A foto precisa ser uma URL válida (http/https)",
    }),
  videoCallLink: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^https?:\/\//.test(value), {
      message: "O link da videochamada precisa ser uma URL válida (http/https)",
    }),
  notificationEmail: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^\S+@\S+\.\S+$/.test(value), {
      message: "Informe um e-mail válido para os avisos",
    }),
  offersDomicilio: z.coerce.boolean().default(false),
  pricePerHourDomicilio: z.coerce.number().min(0).optional(),
  domicilioAddress: z.string().trim().optional(),
});

export async function updateTeacherProfileAction(
  _prevState: TeacherProfileState,
  formData: FormData
): Promise<TeacherProfileState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "PROFESSORA") {
    return { error: "Não autorizado" };
  }

  const parsed = profileSchema.safeParse({
    bio: formData.get("bio"),
    specialties: formData.get("specialties"),
    credentials: formData.get("credentials") || undefined,
    whatsapp: formData.get("whatsapp"),
    pricePerHour: formData.get("pricePerHour"),
    photoUrl: formData.get("photoUrl") || undefined,
    videoCallLink: formData.get("videoCallLink") || undefined,
    notificationEmail: formData.get("notificationEmail") || undefined,
    offersDomicilio: formData.get("offersDomicilio"),
    pricePerHourDomicilio: formData.get("pricePerHourDomicilio") || undefined,
    domicilioAddress: formData.get("domicilioAddress") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const data = parsed.data;

  await prisma.teacherProfile.update({
    where: { userId: session.user.id },
    data: {
      bio: data.bio,
      specialties: data.specialties,
      credentials: data.credentials || null,
      whatsapp: data.whatsapp,
      pricePerHour: data.pricePerHour,
      photoUrl: data.photoUrl || null,
      videoCallLink: data.videoCallLink || null,
      notificationEmail: data.notificationEmail || null,
      offersDomicilio: data.offersDomicilio,
      pricePerHourDomicilio: data.offersDomicilio
        ? (data.pricePerHourDomicilio ?? 0)
        : null,
      domicilioAddress: data.offersDomicilio
        ? data.domicilioAddress || null
        : null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/professoras");
  revalidatePath("/domicilio");
  revalidatePath("/");
  return { success: true };
}
