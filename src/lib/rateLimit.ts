import { prisma } from "@/lib/prisma";

/**
 * Verifica se uma chave (ex: "login:email@x.com" ou "cadastro:1.2.3.4") já
 * bateu o limite de tentativas numa janela de tempo. Não registra a
 * tentativa sozinho — chame `recordAttempt` separadamente, no momento certo
 * de cada fluxo (ver comentários em cada action).
 */
export async function isRateLimited(
  key: string,
  { maxAttempts, windowMinutes }: { maxAttempts: number; windowMinutes: number }
): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
  const count = await prisma.rateLimitAttempt.count({
    where: { key, createdAt: { gte: windowStart } },
  });
  return count >= maxAttempts;
}

export async function recordAttempt(key: string): Promise<void> {
  await prisma.rateLimitAttempt.create({ data: { key } });
}

const RATE_LIMIT_MESSAGE =
  "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.";

export { RATE_LIMIT_MESSAGE };
