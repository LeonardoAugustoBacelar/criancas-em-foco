"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { isRateLimited, recordAttempt } from "@/lib/rateLimit";

export type RequestResetState = {
  message?: string;
  error?: string;
};

const requestSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

const GENERIC_MESSAGE =
  "Se esse e-mail estiver cadastrado, você vai receber um link para redefinir sua senha em instantes.";

const MAX_ATTEMPTS = 3;
const WINDOW_MINUTES = 15;

export async function requestPasswordResetAction(
  _prevState: RequestResetState,
  formData: FormData
): Promise<RequestResetState> {
  const parsed = requestSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "E-mail inválido" };
  }

  const email = parsed.data.email.toLowerCase();
  const key = `reset:${email}`;

  // Verifica o limite antes de mexer no banco, mas sempre registra a
  // tentativa — mesmo resultado (limitado ou não) exista ou não a conta,
  // pra não virar um jeito de descobrir quais e-mails estão cadastrados.
  const limited = await isRateLimited(key, { maxAttempts: MAX_ATTEMPTS, windowMinutes: WINDOW_MINUTES });
  await recordAttempt(key);

  if (limited) {
    return { message: GENERIC_MESSAGE };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { teacherProfile: true },
  });

  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const resetUrl = `${siteUrl}/redefinir-senha?token=${token}`;

    // O e-mail de LOGIN pode estar num domínio sem caixa de entrada de
    // verdade (já aconteceu) — se a pessoa tiver um e-mail de avisos
    // configurado, o link vai pra lá em vez do e-mail de login.
    const deliveryEmail = user.teacherProfile?.notificationEmail || user.email;

    try {
      await sendPasswordResetEmail(deliveryEmail, resetUrl);
    } catch (error) {
      console.error("Falha ao enviar e-mail de redefinição de senha", error);
    }
  }

  // Mesma mensagem sempre, exista ou não o e-mail: evita expor quais
  // e-mails estão cadastrados na plataforma.
  return { message: GENERIC_MESSAGE };
}

export type ResetPasswordState = {
  error?: string;
  success?: boolean;
};

const resetSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export async function resetPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token: parsed.data.token },
  });

  if (
    !resetToken ||
    resetToken.usedAt ||
    resetToken.expiresAt.getTime() < Date.now()
  ) {
    return {
      error: "Este link expirou ou já foi usado. Solicite um novo.",
    };
  }

  const hashed = await bcrypt.hash(parsed.data.password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashed },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return { success: true };
}
