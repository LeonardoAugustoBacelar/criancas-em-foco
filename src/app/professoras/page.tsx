import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import TeacherCard from "@/components/TeacherCard";
import SectionMark from "@/components/SectionMark";

export const metadata: Metadata = {
  title: "Nossa professora",
  description:
    "Conheça a Gilda, professora especializada em comportamento infantil e pedagogia — alfabetização, reforço escolar e apoio comportamental — pronta para ajudar seu filho em casa ou na escola.",
};

export default async function ProfessorasPage() {
  const teachers = await prisma.teacherProfile.findMany({
    where: { approved: true },
    include: { user: true, reviews: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-serif-display text-3xl font-semibold text-primary-700">
        Nossa professora
      </h1>
      <SectionMark color="sky" align="left" />
      <p className="mt-2 max-w-2xl text-primary-700/80">
        A Florescer Kids conta, por enquanto, com uma única professora: a
        Gilda, especializada em comportamento infantil e pedagogia, pronta
        para ajudar seu filho em casa ou na escola.
      </p>

      {teachers.length === 0 ? (
        <p className="mt-10 text-primary-700/70">
          Nenhuma professora disponível no momento.
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
