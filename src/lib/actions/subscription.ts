"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { preApprovalClient } from "@/lib/mercadopago";

export type SubscriptionState = {
  error?: string;
};

const checkoutSchema = z.object({
  planId: z.string().min(1),
});

export async function createSubscriptionCheckoutAction(
  _prevState: SubscriptionState,
  formData: FormData
): Promise<SubscriptionState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "MAE") {
    return { error: "Entre com uma conta de mãe para assinar um plano." };
  }

  const parsed = checkoutSchema.safeParse({ planId: formData.get("planId") });
  if (!parsed.success) {
    return { error: "Plano inválido" };
  }

  const plan = await prisma.plan.findUnique({ where: { id: parsed.data.planId } });
  if (!plan || !plan.active) {
    return { error: "Este plano não está mais disponível" };
  }

  const existing = await prisma.subscription.findUnique({
    where: { maeId: session.user.id },
  });

  if (existing?.status === "ATIVA" && existing.planId === plan.id) {
    return { error: "Você já está neste plano." };
  }

  const mae = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Trocando de plano: cancela a assinatura anterior no Mercado Pago antes
  // de criar a nova, para não cobrar os dois planos ao mesmo tempo.
  if (existing?.status === "ATIVA" && existing.mpPreapprovalId) {
    try {
      await preApprovalClient.update({
        id: existing.mpPreapprovalId,
        body: { status: "cancelled" },
      });
    } catch {
      return {
        error: "Não foi possível cancelar seu plano atual para trocar. Tente novamente.",
      };
    }
  }

  let checkoutUrl: string;
  try {
    const preapproval = await preApprovalClient.create({
      body: {
        reason: `Crianças em Foco — ${plan.name}`,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: plan.price,
          currency_id: "BRL",
        },
        back_url: `${siteUrl}/dashboard`,
        payer_email: mae.email,
        external_reference: mae.id,
        status: "pending",
      },
    });

    if (!preapproval.init_point || !preapproval.id) {
      return { error: "Não foi possível iniciar o checkout. Tente novamente." };
    }

    await prisma.subscription.upsert({
      where: { maeId: mae.id },
      create: {
        maeId: mae.id,
        planId: plan.id,
        status: "PENDENTE",
        mpPreapprovalId: preapproval.id,
      },
      update: {
        planId: plan.id,
        status: "PENDENTE",
        mpPreapprovalId: preapproval.id,
      },
    });

    checkoutUrl = preapproval.init_point;
  } catch {
    return {
      error:
        "Não foi possível conectar ao Mercado Pago. Verifique as credenciais configuradas.",
    };
  }

  redirect(checkoutUrl);
}

export async function cancelSubscriptionAction() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Não autorizado");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { maeId: session.user.id },
  });

  if (!subscription) {
    throw new Error("Assinatura não encontrada");
  }

  if (subscription.mpPreapprovalId) {
    await preApprovalClient.update({
      id: subscription.mpPreapprovalId,
      body: { status: "cancelled" },
    });
  }

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { status: "CANCELADA" },
  });

  revalidatePath("/dashboard");
}
