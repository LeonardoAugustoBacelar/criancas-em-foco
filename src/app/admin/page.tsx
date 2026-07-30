import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TeacherApprovalToggle from "@/components/dashboard/TeacherApprovalToggle";

export const metadata: Metadata = {
  title: "Administração",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const teachers = await prisma.teacherProfile.findMany({
    include: { user: true, bookings: true },
    orderBy: { createdAt: "desc" },
  });

  const subscriptions = await prisma.subscription.findMany({
    include: { mae: true, plan: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-serif-display text-3xl font-semibold text-primary-700">
        Painel de administração
      </h1>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-primary-700">Professoras</h2>
        <div className="mt-4 space-y-3">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary-100 bg-white p-5"
            >
              <div>
                <p className="font-bold text-primary-700">
                  {teacher.user.name}
                </p>
                <p className="text-sm text-primary-700/70">
                  {teacher.user.email} · {teacher.specialties}
                </p>
                <p className="text-xs text-primary-700/60">
                  {teacher.bookings.length} aula(s) agendada(s)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    teacher.approved
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {teacher.approved ? "Aprovada" : "Pendente"}
                </span>
                <TeacherApprovalToggle
                  teacherId={teacher.id}
                  approved={teacher.approved}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-primary-700">Assinaturas</h2>
        {subscriptions.length === 0 ? (
          <p className="mt-4 text-primary-700/80">
            Nenhuma assinatura criada ainda.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary-100 bg-white p-5"
              >
                <div>
                  <p className="font-bold text-primary-700">{sub.mae.name}</p>
                  <p className="text-sm text-primary-700/70">
                    Plano {sub.plan.name} · {sub.mae.email}
                  </p>
                </div>
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
