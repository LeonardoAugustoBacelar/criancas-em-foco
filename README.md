# Florescer Kids

Plataforma que conecta mães a professoras especializadas em **comportamento infantil e pedagogia** — aulas particulares (TDAH, TEA, birras, ansiedade, alfabetização, reforço escolar), com agendamento online, pagamento por PIX e contato direto por WhatsApp.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss) ![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748?logo=prisma) ![Deploy](https://img.shields.io/badge/deploy-Vercel-black?logo=vercel)

![Página inicial do Florescer Kids](docs/screenshot-home.png)

## Sobre o projeto

Mães que enfrentam desafios de comportamento ou aprendizagem com os filhos costumam pesquisar ajuda sozinhas, à noite, cansadas, sem saber por onde começar. O Florescer Kids existe para tornar esse primeiro passo simples: a mãe conhece o perfil de uma professora especializada, vê especialidades, avaliações reais de outras famílias e preço, e já sai agendando uma aula ou falando direto no WhatsApp — sem formulário longo, sem espera.

O modelo é intencionalmente enxuto: cada professora tem um perfil completo (bio, especialidades, fotos), a mãe agenda diretamente num horário fixo de atendimento (segunda a sexta a partir das 17h, fins de semana a partir das 14h) e paga a aula via PIX, direto para a professora. Um painel de administração permite acompanhar reservas e aprovar novas professoras.

## Funcionalidades

- **Perfis de professoras** com bio, foto, tags de especialidade coloridas por categoria e avaliações reais de mães
- **Página de horários** com a disponibilidade dos próximos dias (fixa: seg-sex a partir das 17h, fins de semana a partir das 14h, no máximo 3 aulas/dia)
- **Agendamento de aulas** com verificação de horário disponível em tempo real (sem overbooking)
- **Pagamento por PIX**: QR code (BR Code) e chave gerados dinamicamente, exibidos na página de horários e no perfil da professora
- **Avaliações**: mães avaliam a aula (1–5 estrelas + comentário) depois de concluída
- **Contato direto por WhatsApp** (click-to-chat) — botão flutuante, por professora e por aula agendada
- **Lembrete automático por e-mail** no dia anterior a cada aula confirmada (cron diário)
- **Painel da mãe**: aulas agendadas, cancelamento, histórico
- **Painel da professora**: perfil, confirmação/cancelamento de aulas
- **Painel de administração**: aprovação de professoras, visão geral das reservas
- **SEO completo**: metadata por página, Open Graph dinâmico, sitemap, robots.txt
- **Identidade visual própria**: paleta editorial com cores por categoria de especialidade, tipografia serifada + mono, animações discretas de scroll

## Tecnologias

| Camada | Stack |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19 + TypeScript |
| Estilo | Tailwind CSS v4, tipografia via `next/font` (Source Serif 4 + Geist) |
| Banco de dados | PostgreSQL via [Neon](https://neon.tech), [Prisma ORM v7](https://www.prisma.io) (`@prisma/adapter-neon`) |
| Autenticação | [NextAuth v5](https://authjs.dev) (credenciais e-mail/senha, papéis mãe / professora / admin) |
| Pagamentos | PIX (BR Code gerado com [`qrcode`](https://www.npmjs.com/package/qrcode), sem intermediário) |
| E-mail | [Resend](https://resend.com) — lembretes de aula e redefinição de senha |
| Deploy | [Vercel](https://vercel.com) (deploy automático a cada push em `main`) |

## Como rodar localmente

Você precisa de um banco Postgres (o mais simples é criar um projeto grátis no [Neon](https://neon.tech) — veja o passo a passo completo na seção de deploy abaixo).

```bash
npm install
cp .env.example .env   # preencha DATABASE_URL e as demais variáveis (veja a tabela abaixo)
npx prisma migrate dev --name init   # cria as tabelas no banco
npm run db:seed                       # cria dados de exemplo (professora, mãe, admin)
npm run dev
```

Acesse http://localhost:3000. As credenciais das contas de teste criadas pelo seed ficam definidas em `prisma/seed.ts` — o próprio script imprime os e-mails no terminal ao rodar.

## Variáveis de ambiente (`.env`)

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | Connection string do Postgres (Neon) |
| `AUTH_SECRET` | Chave usada pelo NextAuth para assinar sessões — gere com `openssl rand -base64 32` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp da equipe (DDI+DDD, só dígitos) usado no botão flutuante do site |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site, usada nos e-mails e no metadata de SEO |
| `RESEND_API_KEY` | Chave de API do Resend, para envio de e-mails transacionais |
| `RESEND_FROM_EMAIL` | Endereço remetente dos e-mails — precisa ser de um domínio verificado no Resend para enviar a qualquer destinatário |
| `CRON_SECRET` | Token que protege a rota do cron de lembretes de aula (`/api/cron/booking-reminders`) |

## Estrutura principal

- `src/app/page.tsx` — landing page (hero, serviços, professoras em destaque, avaliações)
- `src/app/professoras` — listagem e perfil da professora, com agendamento, PIX e avaliações
- `src/app/horarios` — disponibilidade dos próximos dias e informações de pagamento por PIX
- `src/app/cadastro`, `src/app/login`, `src/app/esqueci-senha` — conta (mãe ou professora), login e recuperação de senha
- `src/app/dashboard` — painel: mães veem aulas agendadas; professoras editam perfil e confirmam aulas
- `src/app/admin` — aprovação de professoras e visão geral das reservas
- `src/app/api/cron/booking-reminders` — envia lembrete por e-mail no dia anterior a cada aula confirmada
- `src/lib/schedule.ts` — regras fixas de horário (dias/horas de atendimento, limite diário)
- `src/lib/pix.ts` — geração do payload PIX (BR Code) e do QR code
- `src/lib/actions` — Server Actions (cadastro, login, agendamento, avaliação, admin)
- `src/components` — componentes de UI compartilhados (`SpecialtyTags`, `SectionMark`, `PixPaymentInfo`, `RatingStars`, formulários)
- `prisma/schema.prisma` — modelos `User`, `TeacherProfile`, `Availability`, `Booking`, `Review`
- `prisma/seed.ts` — dados de exemplo

## Sobre a integração com WhatsApp

A integração é via **click-to-chat** (`https://wa.me/<número>?text=...`), que não exige aprovação da Meta nem tem custo — funciona com qualquer número comum. Aparece em três lugares: botão flutuante em todas as páginas, botão no perfil de cada professora (com mensagem pré-preenchida) e botão em cada aula agendada no painel da mãe.

Se no futuro for necessário automatizar respostas ou confirmações, é possível evoluir para a **WhatsApp Business API** (Meta Cloud API ou provedores como Twilio/Z-API), mas isso exige aprovação de conta business e tem custo por mensagem.

## Como configurar o pagamento por PIX

Não há integração com gateway de pagamento: o site gera um QR code (BR Code) e mostra a chave PIX da professora, e o pagamento é feito manualmente, fora da plataforma — a mãe agenda a aula, paga direto para a professora e o agendamento é confirmado por confiança (sem verificação automática de pagamento).

Os dados do recebedor (chave PIX, nome e cidade — exigidos pelo padrão do Banco Central) ficam em `PIX_CONFIG`, no topo de `src/lib/pix.ts`. Para trocar a chave ou o nome exibido, edite essa constante — não é uma variável de ambiente.

As regras de horário (dias/horas de atendimento e limite de aulas por dia) ficam em `SCHEDULE_RULES`, em `src/lib/schedule.ts`.

## Deploy (passo a passo)

### 1. Banco de dados (Neon)

Crie uma conta em https://neon.tech, crie um projeto (região São Paulo/`sa-east-1` se disponível) e copie a connection string para `DATABASE_URL`.

### 2. GitHub

```bash
git remote add origin https://github.com/SEU-USUARIO/criancas-em-foco.git
git branch -M main
git push -u origin main
```

### 3. Vercel

1. Importe o repositório em https://vercel.com (Add New → Project)
2. A Vercel detecta Next.js automaticamente
3. Antes do primeiro deploy, adicione todas as variáveis da tabela acima em **Environment Variables**
4. Clique em **Deploy**

Depois do primeiro deploy, um domínio próprio pode ser configurado em **Project Settings → Domains**.

### 4. Depois do deploy

- Configure o cron de lembretes (`vercel.json` já define o schedule) e garanta que `CRON_SECRET` está setado
- Todo `git push` em `main` publica uma nova versão automaticamente

## Roadmap

**Confiança/conversão**
- Selo de verificação/formação no perfil da professora
- Aviso de segurança sobre pagamento ("não pedimos pagamento fora da plataforma")
- FAQ com dúvidas comuns

**Infraestrutura**
- Verificação do domínio próprio no Resend (hoje o envio de e-mail é limitado ao modo sandbox)
- Testes automatizados e CI (lint/build/test a cada push)
- Rate limiting em login, cadastro e recuperação de senha
- Monitoramento de erros em produção e analytics de conversão
