import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const REMOVED_TEACHER_EMAILS = [
  "fernanda@criancasemfoco.com.br",
  "juliana@criancasemfoco.com.br",
  "patricia@criancasemfoco.com.br",
];

const GILDA = {
  name: "Gilda Bacelar",
  email: "gilda@florescerkids.com.br",
  phone: "11970406208",
  whatsapp: "5511970406208",
  photoUrl: "/images/gilda.jpg",
  specialties:
    "TDAH, TEA, birras, ansiedade infantil, dificuldades escolares e regulação emocional, Alfabetização e letramento, Leitura e escrita, Matemática, Auxílio nas tarefas escolares, Desenvolvimento da autonomia e da confiança",
  bio: `Pedagoga e psicopedagoga com mais de 15 anos de experiência, Gilda acredita que cada criança aprende e se desenvolve no seu próprio tempo. Por isso, toda aula é construída a partir da realidade específica da sua família — nunca de um roteiro pronto.

No apoio comportamental, ela trabalha com crianças que têm crises de birra frequentes, dificuldade de concentração (TDAH), características do espectro autista (TEA) ou sinais de ansiedade. Antes de qualquer estratégia, ela escuta o que você já tentou e o que realmente acontece no dia a dia — e te orienta sobre como agir em casa, entre um encontro e outro.

No apoio pedagógico, ela acompanha o processo de alfabetização e letramento, leitura e escrita, matemática e as tarefas escolares, com atividades adequadas ao ritmo de cada criança. O objetivo não é só o conteúdo: é fortalecer, aos poucos, a autonomia e a confiança da criança nos próprios estudos.

Cada aula é adaptada à realidade da família, sempre com orientação direta para a mãe sobre como agir no dia a dia.`,
  pricePerHour: 60,
};

async function main() {
  const passwordHash = await bcrypt.hash("senha123", 10);

  await prisma.user.deleteMany({
    where: { email: { in: REMOVED_TEACHER_EMAILS } },
  });

  const existingGilda = await prisma.user.findUnique({
    where: { email: GILDA.email },
  });

  if (!existingGilda) {
    await prisma.user.create({
      data: {
        name: GILDA.name,
        email: GILDA.email,
        phone: GILDA.phone,
        password: passwordHash,
        role: "PROFESSORA",
        teacherProfile: {
          create: {
            bio: GILDA.bio,
            specialties: GILDA.specialties,
            whatsapp: GILDA.whatsapp,
            pricePerHour: GILDA.pricePerHour,
            photoUrl: GILDA.photoUrl,
          },
        },
      },
    });
  }

  const maeEmail = "mae.exemplo@florescerkids.com.br";
  const existingMae = await prisma.user.findUnique({ where: { email: maeEmail } });
  if (!existingMae) {
    await prisma.user.create({
      data: {
        name: "Mãe Exemplo",
        email: maeEmail,
        phone: "11955554444",
        password: passwordHash,
        role: "MAE",
      },
    });
  }

  const adminEmail = "admin@florescerkids.com.br";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: "Administração",
        email: adminEmail,
        phone: "11900000000",
        password: passwordHash,
        role: "ADMIN",
      },
    });
  }

  console.log("Seed concluído. Logins de teste (senha: senha123):");
  console.log("  Mãe: mae.exemplo@florescerkids.com.br");
  console.log("  Professora: gilda@florescerkids.com.br");
  console.log("  Admin: admin@florescerkids.com.br");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
