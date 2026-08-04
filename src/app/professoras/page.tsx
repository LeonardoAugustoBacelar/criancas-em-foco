import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import TeacherCard from "@/components/TeacherCard";
import SectionMark from "@/components/SectionMark";

export const metadata: Metadata = {
  title: "Professoras especializadas",
  description:
    "Conheça professoras especializadas em comportamento infantil e pedagogia — alfabetização, reforço escolar e apoio comportamental — prontas para ajudar seu filho em casa ou na escola.",
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
    include: { user: true, reviews: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-serif-display text-3xl font-semibold text-primary-700">
        Nossas professoras
      </h1>
      <SectionMark color="sky" align="left" />
      <p className="mt-2 max-w-2xl text-primary-700/80">
        Profissionais especializadas em comportamento infantil e pedagogia,
        prontas para ajudar seu filho em casa ou na escola.
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
            <TeacherCard key={teacher.id} teacher={teacher} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
