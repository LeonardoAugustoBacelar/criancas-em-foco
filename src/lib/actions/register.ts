"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/clientIp";
import { isRateLimited, recordAttempt, RATE_LIMIT_MESSAGE } from "@/lib/rateLimit";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 60;

const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(8, "Informe um telefone válido"),
  password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres"),
  acceptedTerms: z.literal("on", {
    message: "Você precisa aceitar os Termos de Uso e a Política de Privacidade",
  }),
});

export type RegisterState = {
  error?: string;
  success?: boolean;
};

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const ip = await getClientIp();
  const key = `cadastro:${ip}`;
  if (await isRateLimited(key, { maxAttempts: MAX_ATTEMPTS, windowMinutes: WINDOW_MINUTES })) {
    return { error: RATE_LIMIT_MESSAGE };
  }
  await recordAttempt(key);

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
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
      role: "MAE",
    },
  });

  return { success: true };
}
