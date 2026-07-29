import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { buildWhatsAppLink, CLINIC_WHATSAPP } from "@/lib/whatsapp";

const SERVICES = [
  {
    title: "Aulas individuais",
    description:
      "Encontros um a um entre a criança e a professora especializada, com foco nas dificuldades específicas de comportamento.",
    icon: "🧩",
  },
  {
    title: "Orientação para mães",
    description:
      "Conversas e materiais práticos para você entender o que está por trás do comportamento do seu filho e como agir no dia a dia.",
    icon: "💬",
  },
  {
    title: "Suporte escolar",
    description:
      "Estratégias combinadas com a escola para reduzir conflitos em sala de aula e melhorar a relação da criança com professores e colegas.",
    icon: "🏫",
  },
  {
    title: "Acompanhamento contínuo",
    description:
      "Agendamento recorrente de aulas e relatórios de evolução, para acompanhar o progresso com o tempo.",
    icon: "📈",
  },
];

const STEPS = [
  {
    title: "1. Conte sua história",
    description:
      "Fale com a gente pelo WhatsApp ou crie uma conta contando os desafios que você enfrenta com seu filho.",
  },
  {
    title: "2. Escolha uma professora",
    description:
      "Veja perfis de professoras especializadas em comportamento infantil e escolha quem combina com sua família.",
  },
  {
    title: "3. Agende as aulas",
    description:
      "Marque horários direto na plataforma, no dia e hora que funcionam para vocês.",
  },
  {
    title: "4. Acompanhe a evolução",
    description:
      "Receba retorno da professora após cada encontro e ajuste o plano conforme a criança avança.",
  },
];

const TESTIMONIALS = [
  {
    name: "Ana Paula, mãe do Bernardo (7 anos)",
    quote:
      "Eu não sabia mais o que fazer com as crises na escola. Depois de algumas aulas, o Bernardo já consegue conversar sobre o que sente antes de explodir.",
  },
  {
    name: "Camila, mãe da Sofia (5 anos)",
    quote:
      "A professora me ajudou a entender que eu também precisava mudar algumas atitudes em casa. Hoje nossa rotina é bem mais leve.",
  },
  {
    name: "Renata, mãe do Théo (9 anos)",
    quote:
      "O contato pelo WhatsApp foi rápido e humano. Em uma semana já tínhamos a primeira aula agendada.",
  },
];

export default async function HomePage() {
  const teachers = await prisma.teacherProfile.findMany({
    where: { approved: true },
    include: { user: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const heroWhatsApp = buildWhatsAppLink(
    CLINIC_WHATSAPP,
    "Olá! Vim pelo site e gostaria de entender como funciona o acompanhamento para meu filho(a)."
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-block rounded-full bg-accent-100 px-4 py-1 text-sm font-semibold text-accent-600">
              Para mães que precisam de apoio de verdade
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-primary-700 sm:text-5xl">
              Ajudamos seu filho a lidar com os desafios de comportamento,
              em casa e na escola
            </h1>
            <p className="mt-5 text-lg text-primary-700/80">
              Conectamos mães a professoras especializadas em comportamento
              infantil, com aulas individuais, orientação para a família e
              acompanhamento contínuo — tudo começando por uma conversa no
              WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={heroWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#1fb857]"
              >
                Falar no WhatsApp agora
              </a>
              <Link
                href="/professoras"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary-500 px-6 py-3 font-semibold text-primary-700 transition hover:bg-primary-100"
              >
                Conhecer as professoras
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-[2.5rem] bg-primary-400/20" />
            <div className="absolute inset-4 flex items-center justify-center rounded-[2rem] bg-white shadow-xl">
              <div className="p-8 text-center">
                <p className="text-6xl">🧒👩‍🏫💛</p>
                <p className="mt-4 font-semibold text-primary-700">
                  Cada criança no seu tempo, com apoio especializado
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-primary-700">
          Como funciona
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.title} className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="font-bold text-accent-600">{step.title}</p>
              <p className="mt-2 text-sm text-primary-700/80">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="bg-primary-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-primary-700">
            Nossos serviços
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="flex gap-4 rounded-2xl bg-white p-6 shadow-sm"
              >
                <span className="text-3xl">{service.icon}</span>
                <div>
                  <p className="font-bold text-primary-700">
                    {service.title}
                  </p>
                  <p className="mt-1 text-sm text-primary-700/80">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professoras em destaque */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-bold text-primary-700">
            Professoras especializadas
          </h2>
          <Link
            href="/professoras"
            className="font-semibold text-accent-600 hover:underline"
          >
            Ver todas →
          </Link>
        </div>

        {teachers.length === 0 ? (
          <p className="mt-8 text-primary-700/70">
            Em breve novas professoras estarão disponíveis por aqui.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((teacher) => (
              <Link
                key={teacher.id}
                href={`/professoras/${teacher.id}`}
                className="group rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full bg-primary-100">
                    {teacher.photoUrl ? (
                      <Image
                        src={teacher.photoUrl}
                        alt={teacher.user.name}
                        fill
                        className="object-cover"
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
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="bg-primary-700 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-white">
            Mães que já contam com a gente
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-2xl bg-white/10 p-6 text-primary-50"
              >
                <p className="text-sm italic">“{testimonial.quote}”</p>
                <p className="mt-4 text-sm font-semibold text-accent-400">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-primary-700">
          Não precisa enfrentar isso sozinha
        </h2>
        <p className="mt-4 text-primary-700/80">
          Fale com a nossa equipe agora mesmo pelo WhatsApp ou crie sua conta
          para agendar uma aula com uma professora especializada.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={heroWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#1fb857]"
          >
            Falar no WhatsApp
          </a>
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-accent-600"
          >
            Criar minha conta
          </Link>
          <Link
            href="/planos"
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary-500 px-6 py-3 font-semibold text-primary-700 transition hover:bg-primary-100"
          >
            Ver planos
          </Link>
        </div>
      </section>
    </div>
  );
}
