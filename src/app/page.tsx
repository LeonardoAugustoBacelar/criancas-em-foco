import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarCheck,
  Ear,
  Heart,
  Home as HomeIcon,
  LineChart,
  MessageCircle,
  Puzzle,
  School,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CLINIC_WHATSAPP } from "@/lib/whatsapp";
import WhatsAppInlineButton from "@/components/WhatsAppInlineButton";

const SERVICES = [
  {
    title: "Aulas individuais",
    description:
      "Encontros um a um entre a criança e a professora especializada, com foco nas dificuldades específicas de comportamento.",
    icon: Puzzle,
  },
  {
    title: "Orientação para mães",
    description:
      "Conversas e materiais práticos para você entender o que está por trás do comportamento do seu filho e como agir no dia a dia.",
    icon: MessageCircle,
  },
  {
    title: "Suporte escolar",
    description:
      "Estratégias combinadas com a escola para reduzir conflitos em sala de aula e melhorar a relação da criança com professores e colegas.",
    icon: School,
  },
  {
    title: "Acompanhamento contínuo",
    description:
      "Agendamento recorrente de aulas e relatórios de evolução, para acompanhar o progresso com o tempo.",
    icon: TrendingUp,
  },
];

const STEPS = [
  {
    step: "1",
    title: "Conte sua história",
    description:
      "Fale com a gente pelo WhatsApp ou crie uma conta contando os desafios que você enfrenta com seu filho.",
    icon: MessageCircle,
  },
  {
    step: "2",
    title: "Escolha uma professora",
    description:
      "Veja perfis de professoras especializadas em comportamento infantil e escolha quem combina com sua família.",
    icon: UserCheck,
  },
  {
    step: "3",
    title: "Agende as aulas",
    description:
      "Marque horários direto na plataforma, no dia e hora que funcionam para vocês.",
    icon: CalendarCheck,
  },
  {
    step: "4",
    title: "Acompanhe a evolução",
    description:
      "Receba retorno da professora após cada encontro e ajuste o plano conforme a criança avança.",
    icon: LineChart,
  },
];

const COMMITMENTS = [
  {
    title: "Escuta antes de qualquer coisa",
    description:
      "Antes de sugerir qualquer estratégia, ouvimos o que você já tentou e o que realmente acontece no dia a dia com seu filho.",
    icon: Ear,
  },
  {
    title: "Orientação também para você",
    description:
      "As aulas não são só com a criança — você recebe orientação prática de como agir em casa entre um encontro e outro.",
    icon: HomeIcon,
  },
  {
    title: "Contato direto e humano",
    description:
      "Sem burocracia: você fala com a professora pelo WhatsApp, no seu ritmo, sem depender de central de atendimento.",
    icon: MessageCircle,
  },
];

const HERO_HIGHLIGHTS = [
  { label: "Aulas individuais com professoras especializadas", icon: Puzzle },
  { label: "Orientação prática para toda a família", icon: HomeIcon },
  { label: "Contato direto pelo WhatsApp, sem burocracia", icon: MessageCircle },
];

export default async function HomePage() {
  const teachers = await prisma.teacherProfile.findMany({
    where: { approved: true },
    include: { user: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const heroWhatsAppMessage =
    "Olá! Vim pelo site e gostaria de entender como funciona o acompanhamento para meu filho(a).";

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-primary-100 bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-accent-600">
              Para mães que precisam de apoio de verdade
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-primary-700 sm:text-5xl">
              Ajudamos seu filho a lidar com os desafios de comportamento,
              em casa e na escola
            </h1>
            <p className="mt-5 text-lg text-primary-500">
              Conectamos mães a professoras especializadas em comportamento
              infantil, com aulas individuais, orientação para a família e
              acompanhamento contínuo — tudo começando por uma conversa no
              WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <WhatsAppInlineButton
                phone={CLINIC_WHATSAPP}
                message={heroWhatsAppMessage}
                label="Falar no WhatsApp agora"
                className="px-6 py-3 text-base"
              />
              <Link
                href="/professoras"
                className="group inline-flex items-center gap-2 rounded-md border border-primary-100 px-6 py-3 font-semibold text-primary-700 transition hover:bg-primary-50"
              >
                Conhecer as professoras
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="relative rounded-lg border border-primary-100 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary-700 text-white">
                  <Heart className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-bold text-primary-700">
                    Cada criança no seu tempo
                  </p>
                  <p className="text-sm text-primary-500">
                    com apoio especializado
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {HERO_HIGHLIGHTS.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-md bg-primary-50 px-4 py-3"
                  >
                    <item.icon className="h-5 w-5 shrink-0 text-accent-600" />
                    <span className="text-sm font-medium text-primary-700">
                      {item.label}
                    </span>
                  </div>
                ))}
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
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="rounded-lg border border-primary-100 bg-white p-6 transition hover:shadow-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                <step.icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-accent-600">
                Passo {step.step}
              </p>
              <p className="mt-1 font-bold text-primary-700">{step.title}</p>
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
                className="flex gap-4 rounded-lg border border-primary-100 bg-white p-6 transition hover:shadow-sm"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                  <service.icon className="h-6 w-6" />
                </span>
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
            className="group inline-flex items-center gap-1 font-semibold text-accent-600 hover:underline"
          >
            Ver todas
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
                className="group rounded-lg border border-primary-100 bg-white p-6 transition hover:shadow-sm"
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

      {/* Compromisso */}
      <section id="depoimentos" className="bg-primary-700 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-white">
            Nosso compromisso com sua família
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {COMMITMENTS.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-white/10 bg-white/5 p-6 text-primary-50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-accent-400">
                  <item.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 font-semibold text-accent-400">
                  {item.title}
                </p>
                <p className="mt-2 text-sm">{item.description}</p>
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
          <WhatsAppInlineButton
            phone={CLINIC_WHATSAPP}
            message={heroWhatsAppMessage}
            className="px-6 py-3 text-base"
          />
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 rounded-md bg-primary-700 px-6 py-3 font-semibold text-white transition hover:bg-primary-600"
          >
            Criar minha conta
          </Link>
          <Link
            href="/planos"
            className="group inline-flex items-center gap-2 rounded-md border border-primary-100 px-6 py-3 font-semibold text-primary-700 transition hover:bg-primary-50"
          >
            Ver planos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
