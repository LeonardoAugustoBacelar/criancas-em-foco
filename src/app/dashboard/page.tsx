import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2, Clock, Video } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BookingActions from "@/components/dashboard/BookingActions";
import CancelBookingButton from "@/components/dashboard/CancelBookingButton";
import TeacherProfileForm from "@/components/dashboard/TeacherProfileForm";
import WhatsAppInlineButton from "@/components/WhatsAppInlineButton";
import ReviewForm from "@/components/forms/ReviewForm";

export const metadata: Metadata = {
  title: "Minha área",
  robots: { index: false, follow: false },
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
  const bookings = await prisma.booking.findMany({
    where: { maeId: userId },
    include: { teacher: { include: { user: true } }, review: true },
    orderBy: { date: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif-display text-3xl font-semibold text-primary-700">
          Minhas aulas
        </h1>
        <Link
          href="/professoras"
          className="rounded-md bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
        >
          Agendar nova aula
        </Link>
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
                {booking.status === "CONFIRMADA" && booking.teacher.videoCallLink && (
                  <a
                    href={booking.teacher.videoCallLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-press inline-flex items-center gap-1.5 rounded-full bg-primary-700 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-600"
                  >
                    <Video className="h-3.5 w-3.5" />
                    Entrar na videochamada
                  </a>
                )}
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
                  <WhatsAppInlineButton
                    phone={booking.teacher.whatsapp}
                    message={`Olá, ${booking.teacher.user.name}! Segue o comprovante do PIX da aula do dia ${new Date(
                      booking.date
                    ).toLocaleDateString("pt-BR")} às ${booking.startTime}:`}
                    label="Enviar comprovante PIX"
                    className="!bg-accent-500 !px-4 !py-2 text-xs hover:!bg-accent-600"
                  />
                )}
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
      bookings: {
        include: { mae: true },
        orderBy: { date: "asc" },
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

  const pending = teacherProfile.bookings.filter((b) => b.status === "PENDENTE");
  const confirmed = teacherProfile.bookings.filter((b) => b.status === "CONFIRMADA");
  const history = teacherProfile.bookings
    .filter((b) => b.status === "CONCLUIDA" || b.status === "CANCELADA")
    .reverse();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif-display text-3xl font-semibold text-primary-700">
          Painel da professora
        </h1>
        {(pending.length > 0 || confirmed.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {pending.length > 0 && (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                {pending.length} aguardando confirmação
              </span>
            )}
            {confirmed.length > 0 && (
              <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
                {confirmed.length} confirmada{confirmed.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}
      </div>

      <section className="mt-6">
        {pending.length === 0 && confirmed.length === 0 ? (
          <p className="text-primary-700/80">
            Nenhuma aula agendada até agora.
          </p>
        ) : (
          <div className="space-y-6">
            {pending.length > 0 && (
              <div>
                <h2 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-amber-700">
                  <Clock className="h-4 w-4" />
                  Aguardando confirmação
                </h2>
                <div className="mt-3 space-y-3">
                  {pending.map((booking) => (
                    <TeacherBookingCard
                      key={booking.id}
                      booking={booking}
                      accent="amber"
                    />
                  ))}
                </div>
              </div>
            )}

            {confirmed.length > 0 && (
              <div>
                <h2 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-primary-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Próximas aulas confirmadas
                </h2>
                <div className="mt-3 space-y-3">
                  {confirmed.map((booking) => (
                    <TeacherBookingCard
                      key={booking.id}
                      booking={booking}
                      accent="primary"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {history.length > 0 && (
        <details className="mt-8 rounded-lg border border-primary-100 bg-white p-5">
          <summary className="cursor-pointer text-sm font-semibold text-primary-700/70">
            Histórico ({history.length})
          </summary>
          <div className="mt-4 space-y-3">
            {history.map((booking) => (
              <TeacherBookingCard
                key={booking.id}
                booking={booking}
                accent="muted"
              />
            ))}
          </div>
        </details>
      )}

      <section className="mt-10 rounded-lg border border-primary-100 bg-primary-50/40 p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-primary-700/70">
          Meu perfil público
        </h2>
        <div className="mt-4">
          <TeacherProfileForm
            bio={teacherProfile.bio}
            specialties={teacherProfile.specialties}
            whatsapp={teacherProfile.whatsapp}
            pricePerHour={teacherProfile.pricePerHour}
            photoUrl={teacherProfile.photoUrl}
            videoCallLink={teacherProfile.videoCallLink}
          />
        </div>
      </section>
    </div>
  );
}

function TeacherBookingCard({
  booking,
  accent,
}: {
  booking: {
    id: string;
    mae: { name: string };
    childName: string;
    date: Date;
    startTime: string;
    endTime: string;
    notes: string | null;
    status: string;
  };
  accent: "amber" | "primary" | "muted";
}) {
  const accentBorder = {
    amber: "border-l-4 border-l-amber-400",
    primary: "border-l-4 border-l-primary-400",
    muted: "border-l-4 border-l-primary-100",
  }[accent];

  return (
    <div
      className={`rounded-lg border border-primary-100 bg-white p-5 ${accentBorder}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-bold text-primary-700">{booking.mae.name}</p>
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

      {(booking.status === "PENDENTE" || booking.status === "CONFIRMADA") && (
        <div className="mt-3">
          <BookingActions bookingId={booking.id} />
        </div>
      )}
    </div>
  );
}
