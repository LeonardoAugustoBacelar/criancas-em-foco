import Link from "next/link";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import SubscribeButton from "@/components/forms/SubscribeButton";

export const metadata: Metadata = {
  title: "Planos de assinatura",
  description:
    "Assine um plano mensal e agende aulas com professoras especializadas em comportamento infantil.",
};

export default async function PlanosPage() {
  const session = await auth();
  const isMae = session?.user?.role === "MAE";

  const plans = await prisma.plan.findMany({
    where: { active: true },
    orderBy: { price: "asc" },
  });

  const subscription = isMae
    ? await prisma.subscription.findUnique({
        where: { maeId: session!.user.id },
        include: { plan: true },
      })
    : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary-700">
          Planos de assinatura
        </h1>
        <p className="mt-2 text-primary-700/80">
          Assine um plano mensal e agende aulas com nossas professoras
          especializadas.
        </p>
      </div>

      {subscription?.status === "ATIVA" && (
        <div className="mx-auto mt-8 max-w-md rounded-lg border border-primary-100 bg-primary-50 p-4 text-center text-sm text-primary-700">
          Você já está no plano <strong>{subscription.plan.name}</strong>.
          Pode trocar de plano a qualquer momento escolhendo outro abaixo, ou
          gerenciar sua assinatura em{" "}
          <Link href="/dashboard" className="font-semibold underline">
            Minha área
          </Link>
          .
        </div>
      )}

      {plans.length === 0 ? (
        <p className="mt-10 text-center text-primary-700/70">
          Nenhum plano disponível no momento.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              data-reveal
              style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}
              className="flex flex-col rounded-lg border border-primary-100 bg-white p-6 transition hover:shadow-sm"
            >
              <p className="text-lg font-bold text-primary-700">{plan.name}</p>
              <p className="mt-2 text-sm text-primary-700/80">
                {plan.description}
              </p>
              <p className="mt-4 text-sm text-primary-700/70">
                {plan.aulasPerMes
                  ? `${plan.aulasPerMes} aulas por mês`
                  : "Aulas ilimitadas"}
              </p>
              <p className="mt-4 text-3xl font-extrabold text-accent-600">
                R$ {plan.price.toFixed(2)}
                <span className="text-sm font-medium text-primary-700/60">
                  {" "}
                  /mês
                </span>
              </p>

              <div className="mt-6">
                {!session?.user ? (
                  <Link
                    href="/login"
                    className="btn-press block rounded-md bg-primary-700 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-primary-600"
                  >
                    Entrar para assinar
                  </Link>
                ) : !isMae ? (
                  <p className="text-center text-sm text-primary-700/70">
                    Apenas contas de mãe podem assinar planos.
                  </p>
                ) : subscription?.status === "ATIVA" &&
                  subscription.planId === plan.id ? (
                  <button
                    disabled
                    className="w-full rounded-md bg-primary-100 px-6 py-3 font-semibold text-primary-700"
                  >
                    Seu plano atual
                  </button>
                ) : (
                  <SubscribeButton
                    planId={plan.id}
                    label={
                      subscription?.status === "ATIVA"
                        ? "Trocar para este plano"
                        : "Assinar este plano"
                    }
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-10 text-center text-xs text-primary-700/60">
        Pagamento processado com segurança pelo Mercado Pago. Você pode
        cancelar sua assinatura a qualquer momento pelo painel.
      </p>
    </div>
  );
}
