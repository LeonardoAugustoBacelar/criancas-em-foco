import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import WhatsAppInlineButton from "@/components/WhatsAppInlineButton";
import CallButton from "@/components/CallButton";
import BookingForm from "@/components/forms/BookingForm";
import RatingStars from "@/components/RatingStars";
import SpecialtyTags from "@/components/SpecialtyTags";
import { summarizeRatings } from "@/lib/reviews";

const getTeacher = cache(async (id: string) => {
  return prisma.teacherProfile.findUnique({
    where: { id },
    include: {
      user: true,
      availabilities: true,
      reviews: {
        include: { mae: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const teacher = await getTeacher(id);

  if (!teacher || !teacher.approved) {
    return { title: "Professora não encontrada" };
  }

  return {
    title: teacher.user.name,
    description: `${teacher.specialties} — conheça o trabalho de ${teacher.user.name}, professora especializada em comportamento infantil na Crianças em Foco.`,
  };
}

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const teacher = await getTeacher(id);

  if (!teacher || !teacher.approved) {
    notFound();
  }

  const session = await auth();
  const isMae = session?.user?.role === "MAE";

  const subscription = isMae
    ? await prisma.subscription.findUnique({ where: { maeId: session!.user.id } })
    : null;
  const hasActiveSubscription = subscription?.status === "ATIVA";

  const upcomingBookings = await prisma.booking.findMany({
    where: {
      teacherId: teacher.id,
      status: { in: ["PENDENTE", "CONFIRMADA"] },
      date: { gte: new Date(new Date().toDateString()) },
    },
    select: { date: true, startTime: true },
  });
  const bookedSlots = upcomingBookings.map((b) => ({
    date: b.date.toISOString().slice(0, 10),
    startTime: b.startTime,
  }));

  const ratingSummary = summarizeRatings(teacher.reviews);

  const whatsappMessage = `Olá, ${teacher.user.name}! Vi seu perfil no site Crianças em Foco e gostaria de saber mais sobre suas aulas.`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-primary-100">
              {teacher.photoUrl ? (
                <Image
                  src={teacher.photoUrl}
                  alt={teacher.user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary-500">
                  {teacher.user.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-700">
                {teacher.user.name}
              </h1>
              <div className="mt-1.5">
                <SpecialtyTags specialties={teacher.specialties} size="md" />
              </div>
              <div className="mt-2">
                <RatingStars
                  average={ratingSummary.average}
                  count={ratingSummary.count}
                />
              </div>
            </div>
          </div>

          <p className="mt-6 whitespace-pre-line text-primary-700/90">
            {teacher.bio}
          </p>

          {teacher.pricePerHour > 0 && (
            <p className="mt-4 font-semibold text-primary-600">
              R$ {teacher.pricePerHour.toFixed(2)} / hora
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <WhatsAppInlineButton
              phone={teacher.whatsapp}
              message={whatsappMessage}
            />
            <CallButton phone={teacher.whatsapp} />
          </div>

          {teacher.reviews.length > 0 && (
            <div className="mt-10">
              <h2 className="font-bold text-primary-700">Avaliações</h2>
              <div className="mt-4 space-y-4">
                {teacher.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-lg border border-primary-100 bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-primary-700">
                        {review.mae.name}
                      </p>
                      <RatingStars average={review.rating} count={1} hideLabel />
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-sm text-primary-700/80">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-primary-100 bg-white p-6">
          <h2 className="font-bold text-primary-700">Agendar aula</h2>

          {!session?.user ? (
            <div className="mt-4 space-y-3 text-sm text-primary-700/80">
              <p>Entre ou crie uma conta de mãe para agendar aulas.</p>
              <Link
                href="/login"
                className="block rounded-md bg-primary-700 px-4 py-2 text-center font-semibold text-white hover:bg-primary-600"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="block rounded-md border border-primary-100 px-4 py-2 text-center font-semibold text-primary-700 hover:bg-primary-50"
              >
                Criar conta
              </Link>
            </div>
          ) : !isMae ? (
            <p className="mt-4 text-sm text-primary-700/80">
              Apenas contas de mãe podem agendar aulas.
            </p>
          ) : !hasActiveSubscription ? (
            <div className="mt-4 space-y-3 text-sm text-primary-700/80">
              <p>
                Você precisa de uma assinatura ativa para agendar aulas com
                nossas professoras.
              </p>
              <Link
                href="/planos"
                className="block rounded-md bg-accent-500 px-4 py-2 text-center font-semibold text-white hover:bg-accent-600"
              >
                Ver planos
              </Link>
            </div>
          ) : (
            <div className="mt-4">
              <BookingForm
                teacherId={teacher.id}
                availabilities={teacher.availabilities}
                bookedSlots={bookedSlots}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
