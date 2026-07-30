import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Professoras especializadas",
  description:
    "Conheça professoras especializadas em comportamento infantil, prontas para ajudar seu filho em casa ou na escola.",
};

export default async function ProfessorasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const teachers = await prisma.teacherProfile.findMany({
    where: {
      approved: true,
      ...(q
        ? {
            OR: [
              { specialties: { contains: q } },
              { bio: { contains: q } },
              { user: { name: { contains: q } } },
            ],
          }
        : {}),
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-primary-700">
        Nossas professoras
      </h1>
      <p className="mt-2 max-w-2xl text-primary-700/80">
        Profissionais especializadas em comportamento infantil, prontas para
        ajudar seu filho em casa ou na escola.
      </p>

      <form className="mt-6 flex max-w-md gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por especialidade (ex: TDAH, birras...)"
          className="flex-1 rounded-md border border-primary-100 bg-white px-4 py-2.5 text-sm text-primary-700 outline-none focus:border-primary-400"
        />
        <button
          type="submit"
          className="btn-press rounded-md bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600"
        >
          Buscar
        </button>
      </form>

      {teachers.length === 0 ? (
        <p className="mt-10 text-primary-700/70">
          Nenhuma professora encontrada para essa busca.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher, index) => (
            <Link
              key={teacher.id}
              href={`/professoras/${teacher.id}`}
              data-reveal
              style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}
              className="group rounded-lg border border-primary-100 bg-white p-6 transition hover:shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-primary-100">
                  {teacher.photoUrl ? (
                    <Image
                      src={teacher.photoUrl}
                      alt={teacher.user.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xl font-bold text-primary-500">
                      {teacher.user.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-primary-700 group-hover:text-accent-600">
                    {teacher.user.name}
                  </p>
                  <p className="text-sm text-primary-700/70">
                    {teacher.specialties}
                  </p>
                </div>
              </div>
              <p className="mt-4 line-clamp-3 text-sm text-primary-700/80">
                {teacher.bio}
              </p>
              {teacher.pricePerHour > 0 && (
                <p className="mt-3 text-sm font-semibold text-primary-600">
                  R$ {teacher.pricePerHour.toFixed(2)} / hora
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
