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
  email: "gilda@criancasemfoco.com.br",
  phone: "11988887777",
  whatsapp: "5511988887777",
  specialties:
    "TDAH, TEA, birras, ansiedade infantil, dificuldades escolares e regulação emocional",
  bio: "Pedagoga e psicopedagoga com mais de 15 anos de experiência, a Gilda atende crianças com os mais diversos desafios de comportamento: crises de birra, dificuldade de concentração (TDAH), características do espectro autista (TEA), ansiedade, conflitos na escola e dificuldades de rotina em casa. Cada aula é adaptada à realidade da família, sempre com orientação direta para a mãe sobre como agir no dia a dia.",
  pricePerHour: 130,
  availabilities: [
    { weekday: 1, startTime: "09:00", endTime: "12:00" },
    { weekday: 2, startTime: "08:00", endTime: "11:00" },
    { weekday: 3, startTime: "14:00", endTime: "17:00" },
    { weekday: 4, startTime: "13:00", endTime: "16:00" },
    { weekday: 5, startTime: "09:00", endTime: "12:00" },
  ],
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
            availabilities: {
              create: GILDA.availabilities,
            },
          },
        },
      },
    });
  }

  const maeEmail = "mae.exemplo@criancasemfoco.com.br";
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

  const adminEmail = "admin@criancasemfoco.com.br";
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

  const PLANS = [
    {
      name: "Essencial",
      description: "Ideal para começar o acompanhamento com uma professora.",
      price: 149,
      aulasPerMes: 2,
    },
    {
      name: "Equilíbrio",
      description: "Acompanhamento mais próximo, com aulas semanais.",
      price: 279,
      aulasPerMes: 4,
    },
    {
      name: "Ilimitado",
      description: "Quantas aulas forem necessárias, sem limite mensal.",
      price: 499,
      aulasPerMes: null,
    },
  ];

  for (const plan of PLANS) {
    const existingPlan = await prisma.plan.findFirst({ where: { name: plan.name } });
    if (existingPlan) continue;
    await prisma.plan.create({ data: plan });
  }

  console.log("Seed concluído. Logins de teste (senha: senha123):");
  console.log("  Mãe: mae.exemplo@criancasemfoco.com.br");
  console.log("  Professora: gilda@criancasemfoco.com.br");
  console.log("  Admin: admin@criancasemfoco.com.br");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
