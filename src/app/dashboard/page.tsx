import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BookingActions from "@/components/dashboard/BookingActions";
import AvailabilityManager from "@/components/dashboard/AvailabilityManager";
import CancelSubscriptionButton from "@/components/dashboard/CancelSubscriptionButton";
import CancelBookingButton from "@/components/dashboard/CancelBookingButton";
import TeacherProfileForm from "@/components/dashboard/TeacherProfileForm";
import WhatsAppInlineButton from "@/components/WhatsAppInlineButton";
import ReviewForm from "@/components/forms/ReviewForm";

export const metadata: Metadata = {
  title: "Minha área",
  robots: { index: false, follow: false },
};

const SUBSCRIPTION_STATUS_LABELS: Record<string, string> = {
  PENDENTE: "Aguardando confirmação de pagamento",
  ATIVA: "Ativa",
  PAUSADA: "Pausada",
  CANCELADA: "Cancelada",
};

const STATUS_LABELS: Record<string, string> = {
  PENDENTE: "Pendente",
  CONFIRMADA: "Confirmada",
  CANCELADA: "Cancelada",
  CONCLUIDA: "Concluída",
};

const STATUS_COLORS: Record<string, string> = {
  PENDENTE: "bg-amber-50 text-amber-700",
  CONFIRMADA: "bg-primary-50 text-primary-700",
  CANCELADA: "bg-red-50 text-red-600",
  CONCLUIDA: "bg-emerald-50 text-emerald-700",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  if (session.user.role === "PROFESSORA") {
    return <ProfessoraDashboard userId={session.user.id} />;
  }

  return <MaeDashboard userId={session.user.id} />;
}

async function MaeDashboard({ userId }: { userId: string }) {
  const [bookings, subscription] = await Promise.all([
    prisma.booking.findMany({
      where: { maeId: userId },
      include: { teacher: { include: { user: true } }, review: true },
      orderBy: { date: "desc" },
    }),
    prisma.subscription.findUnique({
      where: { maeId: userId },
      include: { plan: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-primary-700">
          Minhas aulas
        </h1>
        <Link
          href="/professoras"
          className="rounded-md bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
        >
          Agendar nova aula
        </Link>
      </div>

      <div className="mt-6 rounded-lg border border-primary-100 bg-white p-5">
        <p className="font-bold text-primary-700">Minha assinatura</p>
        {subscription ? (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-primary-700/80">
              <p>
                Plano <strong>{subscription.plan.name}</strong> —{" "}
                {SUBSCRIPTION_STATUS_LABELS[subscription.status]}
              </p>
              {subscription.status === "PENDENTE" && (
                <p className="mt-1 text-xs text-primary-700/60">
                  O pagamento ainda está sendo confirmado pelo Mercado Pago.
                </p>
              )}
            </div>
            {subscription.status === "ATIVA" && <CancelSubscriptionButton />}
          </div>
        ) : (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-primary-700/80">
              Você ainda não tem um plano ativo.
            </p>
            <Link
              href="/planos"
              className="rounded-md bg-primary-700 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-600"
            >
              Ver planos
            </Link>
          </div>
        )}
      </div>

      {bookings.length === 0 ? (
        <p className="mt-8 text-primary-700/80">
          Você ainda não agendou nenhuma aula.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-lg border border-primary-100 bg-white p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-primary-700">
                    {booking.teacher.user.name}
                  </p>
                  <p className="text-sm text-primary-700/70">
                    Criança: {booking.childName}
                  </p>
                  <p className="text-sm text-primary-700/70">
                    {new Date(booking.date).toLocaleDateString("pt-BR")} ·{" "}
                    {booking.startTime} às {booking.endTime}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[booking.status]}`}
                >
                  {STATUS_LABELS[booking.status]}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <WhatsAppInlineButton
                  phone={booking.teacher.whatsapp}
                  message={`Olá, ${booking.teacher.user.name}! Sobre a aula do dia ${new Date(
                    booking.date
                  ).toLocaleDateString("pt-BR")} às ${booking.startTime}...`}
                  label="Falar com a professora"
                  className="!px-4 !py-2 text-xs"
                />
                {(booking.status === "PENDENTE" ||
                  booking.status === "CONFIRMADA") && (
                  <CancelBookingButton bookingId={booking.id} />
                )}
              </div>

              {booking.status === "CONCLUIDA" && !booking.review && (
                <div className="mt-3">
                  <ReviewForm bookingId={booking.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

async function ProfessoraDashboard({ userId }: { userId: string }) {
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
    include: {
      availabilities: true,
      bookings: {
        include: { mae: true },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!teacherProfile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-6">
        <p className="text-primary-700">
          Não encontramos um perfil de professora associado à sua conta.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-primary-700">
        Painel da professora
      </h1>

      <section className="mt-8 rounded-lg border border-primary-100 bg-white p-6">
        <h2 className="font-bold text-primary-700">Meu perfil público</h2>
        <div className="mt-4">
          <TeacherProfileForm
            bio={teacherProfile.bio}
            specialties={teacherProfile.specialties}
            whatsapp={teacherProfile.whatsapp}
            pricePerHour={teacherProfile.pricePerHour}
            photoUrl={teacherProfile.photoUrl}
          />
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-primary-100 bg-white p-6">
        <h2 className="font-bold text-primary-700">Meus horários</h2>
        <div className="mt-4">
          <AvailabilityManager availabilities={teacherProfile.availabilities} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-primary-700">
          Solicitações de aula
        </h2>

        {teacherProfile.bookings.length === 0 ? (
          <p className="mt-4 text-primary-700/80">
            Nenhuma solicitação de aula até agora.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {teacherProfile.bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-lg border border-primary-100 bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-primary-700">
                      {booking.mae.name}
                    </p>
                    <p className="text-sm text-primary-700/70">
                      Criança: {booking.childName}
                    </p>
                    <p className="text-sm text-primary-700/70">
                      {new Date(booking.date).toLocaleDateString("pt-BR")} ·{" "}
                      {booking.startTime} às {booking.endTime}
                    </p>
                    {booking.notes && (
                      <p className="mt-1 text-sm italic text-primary-700/60">
                        &quot;{booking.notes}&quot;
                      </p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[booking.status]}`}
                  >
                    {STATUS_LABELS[booking.status]}
                  </span>
                </div>

                {(booking.status === "PENDENTE" ||
                  booking.status === "CONFIRMADA") && (
                  <div className="mt-3">
                    <BookingActions bookingId={booking.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
