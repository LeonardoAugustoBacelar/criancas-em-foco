import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
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
import RatingStars from "@/components/RatingStars";
import SpecialtyTags from "@/components/SpecialtyTags";
import { summarizeRatings } from "@/lib/reviews";

const STOCK_PHOTOS = {
  hug: "https://images.unsplash.com/photo-1752652011858-302f08a6dc9f?auto=format&fit=crop&w=1200&q=80",
  homework:
    "https://images.unsplash.com/photo-1758685733907-42e9651721f5?auto=format&fit=crop&w=1200&q=80",
  couch:
    "https://images.unsplash.com/photo-1758598737810-7489fde716af?auto=format&fit=crop&w=1200&q=80",
};

const COLOR_STYLES = {
  accent: { bg: "bg-accent-100", text: "text-accent-600", dark: "text-accent-400" },
  warm: { bg: "bg-warm-100", text: "text-warm-600", dark: "text-warm-400" },
  sky: { bg: "bg-sky-100", text: "text-sky-600", dark: "text-sky-400" },
} as const;

const SERVICES: {
  title: string;
  description: string;
  icon: typeof Puzzle;
  color: keyof typeof COLOR_STYLES;
}[] = [
  {
    title: "Aulas individuais",
    description:
      "Encontros só entre a professora e o seu filho — sem roteiro pronto. Cada aula é montada em cima do que realmente acontece na sua casa: birras frequentes, dificuldade de concentração, características do espectro autista (TEA), TDAH ou dificuldade de lidar com frustração.",
    icon: Puzzle,
    color: "accent",
  },
  {
    title: "Orientação para mães",
    description:
      "Você não precisa adivinhar sozinha o que fazer. A professora explica o que está por trás de cada comportamento e te dá orientações práticas para aplicar entre uma aula e outra — porque a mudança acontece em casa, no dia a dia, não só durante a aula.",
    icon: MessageCircle,
    color: "warm",
  },
  {
    title: "Suporte escolar",
    description:
      "Quando a escola liga com frequência, dói. Alinhamos estratégias com professores e coordenação para reduzir conflitos em sala de aula e melhorar a relação do seu filho com colegas e professores, respeitando o ritmo dele.",
    icon: School,
    color: "sky",
  },
  {
    title: "Acompanhamento contínuo",
    description:
      "Nada de aula avulsa que não leva a lugar nenhum. Agende aulas recorrentes e receba relatórios de evolução após cada encontro, para acompanhar de perto — e comemorar — cada progresso do seu filho com o tempo.",
    icon: TrendingUp,
    color: "warm",
  },
];

const TARGET_SITUATIONS = [
  "Seu filho tem crises de birra frequentes e você já não sabe mais como agir",
  "Ele foi diagnosticado com TDAH ou TEA e você quer apoio especializado no dia a dia",
  "A escola te chama com frequência por causa de conflitos de comportamento",
  "Ele mostra sinais de ansiedade, choro fácil ou dificuldade de se regular emocionalmente",
  "Você sente que está sozinha nessa rotina e gostaria de orientação de quem entende",
];

const STEPS: {
  step: string;
  title: string;
  description: string;
  icon: typeof MessageCircle;
  color: keyof typeof COLOR_STYLES;
}[] = [
  {
    step: "1",
    title: "Conte sua história",
    description:
      "Fale com a gente pelo WhatsApp ou crie uma conta contando os desafios que você enfrenta com seu filho.",
    icon: MessageCircle,
    color: "accent",
  },
  {
    step: "2",
    title: "Escolha uma professora",
    description:
      "Veja perfis de professoras especializadas em comportamento infantil e escolha quem combina com sua família.",
    icon: UserCheck,
    color: "warm",
  },
  {
    step: "3",
    title: "Agende as aulas",
    description:
      "Marque horários direto na plataforma, no dia e hora que funcionam para vocês.",
    icon: CalendarCheck,
    color: "sky",
  },
  {
    step: "4",
    title: "Acompanhe a evolução",
    description:
      "Receba retorno da professora após cada encontro e ajuste o plano conforme a criança avança.",
    icon: LineChart,
    color: "accent",
  },
];

const COMMITMENTS: {
  title: string;
  description: string;
  icon: typeof Ear;
  color: keyof typeof COLOR_STYLES;
}[] = [
  {
    title: "Escuta antes de qualquer coisa",
    description:
      "Antes de sugerir qualquer estratégia, ouvimos o que você já tentou e o que realmente acontece no dia a dia com seu filho.",
    icon: Ear,
    color: "warm",
  },
  {
    title: "Orientação também para você",
    description:
      "As aulas não são só com a criança — você recebe orientação prática de como agir em casa entre um encontro e outro.",
    icon: HomeIcon,
    color: "sky",
  },
  {
    title: "Contato direto e humano",
    description:
      "Sem burocracia: você fala com a professora pelo WhatsApp, no seu ritmo, sem depender de central de atendimento.",
    icon: MessageCircle,
    color: "accent",
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
    include: { user: true, reviews: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const featuredReviews = await prisma.review.findMany({
    where: { comment: { not: null } },
    include: { mae: true, teacher: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
    take: 3,
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
                className="btn-press px-6 py-3 text-base"
              />
              <Link
                href="/professoras"
                className="btn-press group inline-flex items-center gap-2 rounded-md border border-primary-100 px-6 py-3 font-semibold text-primary-700 transition-colors hover:bg-primary-50"
              >
                Conhecer as professoras
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="relative h-64 overflow-hidden rounded-lg shadow-sm sm:h-72">
              <Image
                src={STOCK_PHOTOS.hug}
                alt="Mãe abraçando a filha com carinho"
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="relative -mt-8 ml-6 mr-2 rounded-lg border border-primary-100 bg-white p-6 shadow-sm sm:ml-10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-700 text-white">
                  <Heart className="h-5 w-5" />
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

              <div className="mt-5 space-y-3">
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
        <h2
          data-reveal
          className="text-center text-3xl font-bold text-primary-700"
        >
          Como funciona
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              data-reveal
              style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}
              className="rounded-lg border border-primary-100 bg-white p-6 transition hover:shadow-sm"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-md ${COLOR_STYLES[step.color].bg} ${COLOR_STYLES[step.color].text}`}
              >
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
          <h2
            data-reveal
            className="text-center text-3xl font-bold text-primary-700"
          >
            Nossos serviços
          </h2>
          <p
            data-reveal
            className="mx-auto mt-4 max-w-2xl text-center text-primary-700/80"
          >
            Sabemos que você chegou até aqui depois de tentar de tudo. Por
            isso, cada serviço foi pensado para apoiar você e o seu filho —
            não só durante a aula, mas na rotina real da sua casa.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {SERVICES.map((service, index) => (
              <div
                key={service.title}
                data-reveal
                style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}
                className="flex gap-4 rounded-lg border border-primary-100 bg-white p-6 transition hover:shadow-sm"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${COLOR_STYLES[service.color].bg} ${COLOR_STYLES[service.color].text}`}
                >
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

      {/* Para quem é */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div
            data-reveal
            className="relative order-2 h-72 overflow-hidden rounded-lg shadow-sm sm:h-96 md:order-1"
          >
            <Image
              src={STOCK_PHOTOS.homework}
              alt="Professora ajudando criança em atividade escolar"
              fill
              className="object-cover"
            />
          </div>
          <div className="order-1 md:order-2" data-reveal>
            <span className="text-sm font-semibold uppercase tracking-wide text-warm-600">
              Para quem é o Crianças em Foco
            </span>
            <h2 className="mt-3 text-3xl font-bold text-primary-700">
              Se você se identifica com alguma dessas situações,
              estamos aqui para ajudar
            </h2>
            <ul className="mt-6 space-y-3">
              {TARGET_SITUATIONS.map((situation) => (
                <li key={situation} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-warm-500" />
                  <span className="text-sm text-primary-700/90 sm:text-base">
                    {situation}
                  </span>
                </li>
              ))}
            </ul>
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
                    <div className="mt-1">
                      <SpecialtyTags specialties={teacher.specialties} />
                    </div>
                    <div className="mt-1.5">
                      <RatingStars {...summarizeRatings(teacher.reviews)} />
                    </div>
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

      {/* Avaliações reais */}
      {featuredReviews.length > 0 && (
        <section className="bg-primary-50 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2
              data-reveal
              className="text-center text-3xl font-bold text-primary-700"
            >
              O que as famílias dizem
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {featuredReviews.map((review, index) => (
                <div
                  key={review.id}
                  data-reveal
                  style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}
                  className="rounded-lg border border-primary-100 bg-white p-6"
                >
                  <RatingStars average={review.rating} count={1} hideLabel />
                  <p className="mt-3 text-sm text-primary-700/90">
                    &quot;{review.comment}&quot;
                  </p>
                  <p className="mt-4 text-sm font-semibold text-primary-700">
                    {review.mae.name}
                  </p>
                  <p className="text-xs text-primary-700/60">
                    aula com {review.teacher.user.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Compromisso */}
      <section id="depoimentos" className="bg-primary-700 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 data-reveal className="text-center text-3xl font-bold text-white">
            Nosso compromisso com sua família
          </h2>
          <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
            <div
              data-reveal
              className="relative h-72 overflow-hidden rounded-lg sm:h-80"
            >
              <Image
                src={STOCK_PHOTOS.couch}
                alt="Mãe e filho sorrindo juntos em casa"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-5">
              {COMMITMENTS.map((item, index) => (
                <div
                  key={item.title}
                  data-reveal
                  style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}
                  className="flex gap-4 rounded-lg border border-white/10 bg-white/5 p-6 text-primary-50"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/10 ${COLOR_STYLES[item.color].dark}`}
                  >
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className={`font-semibold ${COLOR_STYLES[item.color].dark}`}>
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section
        data-reveal
        className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6"
      >
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
            className="btn-press px-6 py-3 text-base"
          />
          <Link
            href="/cadastro"
            className="btn-press inline-flex items-center gap-2 rounded-md bg-primary-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-600"
          >
            Criar minha conta
          </Link>
          <Link
            href="/planos"
            className="btn-press group inline-flex items-center gap-2 rounded-md border border-primary-100 px-6 py-3 font-semibold text-primary-700 transition-colors hover:bg-primary-50"
          >
            Ver planos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
