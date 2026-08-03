import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getDaySlots, isWeekend, SCHEDULE_RULES } from "@/lib/schedule";
import PixPaymentInfo from "@/components/PixPaymentInfo";
import SectionMark from "@/components/SectionMark";

export const metadata: Metadata = {
  title: "Horários disponíveis",
  description:
    "Veja os horários disponíveis para agendar uma aula e como pagar via PIX.",
};

const WEEKDAY_LABELS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

const DAYS_TO_SHOW = 14;

export default async function HorariosPage() {
  const teacher = await prisma.teacherProfile.findFirst({
    where: { approved: true },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  const today = new Date(new Date().toDateString());
  const rangeEnd = new Date(today);
  rangeEnd.setDate(rangeEnd.getDate() + DAYS_TO_SHOW);

  const bookings = teacher
    ? await prisma.booking.findMany({
        where: {
          teacherId: teacher.id,
          status: { in: ["PENDENTE", "CONFIRMADA"] },
          date: { gte: today, lt: rangeEnd },
        },
        select: { date: true, startTime: true },
      })
    : [];

  const bookedByDate = new Map<string, Set<string>>();
  for (const booking of bookings) {
    const key = booking.date.toISOString().slice(0, 10);
    if (!bookedByDate.has(key)) bookedByDate.set(key, new Set());
    bookedByDate.get(key)!.add(booking.startTime);
  }

  const days = Array.from({ length: DAYS_TO_SHOW }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const key = date.toISOString().slice(0, 10);
    const takenTimes = bookedByDate.get(key) ?? new Set<string>();
    const slots = getDaySlots(date).map((slot) => ({
      ...slot,
      taken: takenTimes.has(slot.startTime),
    }));
    const dayIsFull = takenTimes.size >= SCHEDULE_RULES.maxBookingsPerDay;
    return { date, slots, dayIsFull };
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-serif-display text-3xl font-semibold text-primary-700">
        Horários disponíveis
      </h1>
      <SectionMark color="accent" align="left" />
      <p className="mt-4 max-w-2xl text-primary-700/80">
        Aulas de {SCHEDULE_RULES.slotDurationMinutes} minutos. Segunda a
        sexta, a partir das {SCHEDULE_RULES.weekdayStart}. Sábado e domingo, a
        partir das {SCHEDULE_RULES.weekendStart}. Até no máximo{" "}
        {SCHEDULE_RULES.maxBookingsPerDay} aulas por dia.
      </p>

      {!teacher ? (
        <p className="mt-8 rounded-lg border border-primary-100 bg-primary-50 p-4 text-primary-700/80">
          Em breve teremos uma professora disponível para agendamento.
        </p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {days.map(({ date, slots, dayIsFull }, index) => (
              <div
                key={date.toISOString()}
                data-reveal
                style={{ "--reveal-delay": `${(index % 6) * 60}ms` } as React.CSSProperties}
                className="rounded-lg border border-primary-100 bg-white p-4"
              >
                <p className="text-sm font-bold text-primary-700">
                  {WEEKDAY_LABELS[date.getDay()]}
                  <span className="font-normal text-primary-700/60">
                    {" "}
                    · {date.toLocaleDateString("pt-BR")}
                  </span>
                  {isWeekend(date) && (
                    <span className="ml-2 rounded-full bg-sun-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sun-600">
                      Fim de semana
                    </span>
                  )}
                </p>
                {dayIsFull ? (
                  <p className="mt-2 text-sm text-primary-700/60">
                    Dia lotado
                  </p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {slots.map((slot) => (
                      <span
                        key={slot.startTime}
                        className={
                          slot.taken
                            ? "rounded-full bg-primary-50 px-2.5 py-1 text-xs text-primary-700/40 line-through"
                            : "rounded-full bg-accent-100 px-2.5 py-1 text-xs font-medium text-accent-600"
                        }
                      >
                        {slot.startTime}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={`/professoras/${teacher.id}`}
              className="btn-press group inline-flex items-center gap-2 rounded-md bg-accent-500 px-6 py-3 font-semibold text-white hover:bg-accent-600"
            >
              Agendar com {teacher.user.name}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </>
      )}

      <div className="mt-10 max-w-lg">
        <PixPaymentInfo />
      </div>
    </div>
  );
}
