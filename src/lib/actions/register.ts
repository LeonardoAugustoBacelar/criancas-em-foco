"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome completo"),
    email: z.string().email("E-mail inválido"),
    phone: z.string().min(8, "Informe um telefone válido"),
    password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres"),
    role: z.enum(["MAE", "PROFESSORA"]),
    bio: z.string().optional(),
    specialties: z.string().optional(),
    whatsapp: z.string().optional(),
    acceptedTerms: z.literal("on", {
      message: "Você precisa aceitar os Termos de Uso e a Política de Privacidade",
    }),
  })
  .refine(
    (data) =>
      data.role !== "PROFESSORA" ||
      (data.bio && data.specialties && data.whatsapp),
    {
      message: "Preencha bio, especialidades e WhatsApp para se cadastrar como professora",
      path: ["bio"],
    }
  );

export type RegisterState = {
  error?: string;
  success?: boolean;
};

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    role: formData.get("role"),
    bio: formData.get("bio") || undefined,
    specialties: formData.get("specialties") || undefined,
    whatsapp: formData.get("whatsapp") || undefined,
    acceptedTerms: formData.get("acceptedTerms") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const data = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return { error: "Já existe uma conta com este e-mail" };
  }

  const hashed = await bcrypt.hash(data.password, 10);

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashed,
      role: data.role,
      teacherProfile:
        data.role === "PROFESSORA"
          ? {
              create: {
                bio: data.bio!,
                specialties: data.specialties!,
                whatsapp: data.whatsapp!,
              },
            }
          : undefined,
    },
  });

  return { success: true };
}
