# Crianças em Foco

Plataforma que conecta mães a professoras especializadas em **comportamento infantil e pedagogia** — aulas particulares (TDAH, TEA, birras, ansiedade, alfabetização, reforço escolar), com agendamento online, assinatura mensal recorrente e contato direto por WhatsApp.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss) ![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748?logo=prisma) ![Deploy](https://img.shields.io/badge/deploy-Vercel-black?logo=vercel)

![Página inicial do Crianças em Foco](docs/screenshot-home.png)

## Sobre o projeto

Mães que enfrentam desafios de comportamento ou aprendizagem com os filhos costumam pesquisar ajuda sozinhas, à noite, cansadas, sem saber por onde começar. O Crianças em Foco existe para tornar esse primeiro passo simples: a mãe conhece o perfil de uma professora especializada, vê especialidades, avaliações reais de outras famílias e preço, e já sai agendando uma aula ou falando direto no WhatsApp — sem formulário longo, sem espera.

O modelo é intencionalmente enxuto: cada professora tem um perfil completo (bio, especialidades, fotos, disponibilidade), a mãe assina um plano mensal com um número fixo de aulas (ou ilimitado) e agenda diretamente nos horários livres da professora. Um painel de administração permite acompanhar assinaturas e aprovar novas professoras.

## Funcionalidades

- **Perfis de professoras** com bio, foto, tags de especialidade coloridas por categoria e avaliações reais de mães
- **Agendamento de aulas** com verificação de horário disponível em tempo real (sem overbooking)
- **Assinaturas mensais recorrentes** via Mercado Pago (Preapproval), com troca de plano e cancelamento pela própria mãe
- **Avaliações**: mães avaliam a aula (1–5 estrelas + comentário) depois de concluída
- **Contato direto por WhatsApp** (click-to-chat) — botão flutuante, por professora e por aula agendada
- **Lembrete automático por e-mail** no dia anterior a cada aula confirmada (cron diário)
- **Painel da mãe**: assinatura, aulas agendadas, cancelamento, histórico
- **Painel da professora**: perfil, horários disponíveis, confirmação/cancelamento de aulas
- **Painel de administração**: aprovação de professoras, visão geral de assinaturas
- **SEO completo**: metadata por página, Open Graph dinâmico, sitemap, robots.txt
- **Identidade visual própria**: paleta editorial com cores por categoria de especialidade, tipografia serifada + mono, animações discretas de scroll

## Tecnologias

| Camada | Stack |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19 + TypeScript |
| Estilo | Tailwind CSS v4, tipografia via `next/font` (Source Serif 4 + Geist) |
| Banco de dados | PostgreSQL via [Neon](https://neon.tech), [Prisma ORM v7](https://www.prisma.io) (`@prisma/adapter-neon`) |
| Autenticação | [NextAuth v5](https://authjs.dev) (credenciais e-mail/senha, papéis mãe / professora / admin) |
| Pagamentos | [Mercado Pago](https://www.mercadopago.com.br) — assinaturas recorrentes (Preapproval) |
| E-mail | [Resend](https://resend.com) — lembretes de aula e redefinição de senha |
| Deploy | [Vercel](https://vercel.com) (deploy automático a cada push em `main`) |

## Como rodar localmente

Você precisa de um banco Postgres (o mais simples é criar um projeto grátis no [Neon](https://neon.tech) — veja o passo a passo completo na seção de deploy abaixo).

```bash
npm install
cp .env.example .env   # preencha DATABASE_URL e as demais variáveis (veja a tabela abaixo)
npx prisma migrate dev --name init   # cria as tabelas no banco
npm run db:seed                       # cria dados de exemplo (professora, mãe, admin, planos)
npm run dev
```

Acesse http://localhost:3000. As credenciais das contas de teste criadas pelo seed ficam definidas em `prisma/seed.ts` — o próprio script imprime os e-mails no terminal ao rodar.

## Variáveis de ambiente (`.env`)

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | Connection string do Postgres (Neon) |
| `AUTH_SECRET` | Chave usada pelo NextAuth para assinar sessões — gere com `openssl rand -base64 32` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp da equipe (DDI+DDD, só dígitos) usado no botão flutuante do site |
| `MERCADOPAGO_ACCESS_TOKEN` | Access token da conta Mercado Pago (produção ou teste) |
| `MERCADOPAGO_WEBHOOK_SECRET` | Chave secreta do webhook, usada para validar notificações do Mercado Pago |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site, usada no checkout, nos e-mails e no metadata de SEO |
| `RESEND_API_KEY` | Chave de API do Resend, para envio de e-mails transacionais |
| `RESEND_FROM_EMAIL` | Endereço remetente dos e-mails — precisa ser de um domínio verificado no Resend para enviar a qualquer destinatário |
| `CRON_SECRET` | Token que protege a rota do cron de lembretes de aula (`/api/cron/booking-reminders`) |

## Estrutura principal

- `src/app/page.tsx` — landing page (hero, serviços, professoras em destaque, avaliações)
- `src/app/professoras` — listagem e perfil da professora, com agendamento e avaliações
- `src/app/cadastro`, `src/app/login`, `src/app/esqueci-senha` — conta (mãe ou professora), login e recuperação de senha
- `src/app/dashboard` — painel: mães veem assinatura e aulas; professoras editam perfil, horários e confirmam aulas
- `src/app/admin` — aprovação de professoras e visão de assinaturas
- `src/app/planos` — planos de assinatura mensal, com checkout do Mercado Pago
- `src/app/api/webhooks/mercadopago` — recebe notificações do Mercado Pago e atualiza a assinatura
- `src/app/api/cron/booking-reminders` — envia lembrete por e-mail no dia anterior a cada aula confirmada
- `src/lib/actions` — Server Actions (cadastro, login, agendamento, disponibilidade, assinatura, avaliação, admin)
- `src/components` — componentes de UI compartilhados (`SpecialtyTags`, `SectionMark`, `RatingStars`, formulários)
- `prisma/schema.prisma` — modelos `User`, `TeacherProfile`, `Availability`, `Booking`, `Review`, `Plan`, `Subscription`
- `prisma/seed.ts` — dados de exemplo

## Sobre a integração com WhatsApp

A integração é via **click-to-chat** (`https://wa.me/<número>?text=...`), que não exige aprovação da Meta nem tem custo — funciona com qualquer número comum. Aparece em três lugares: botão flutuante em todas as páginas, botão no perfil de cada professora (com mensagem pré-preenchida) e botão em cada aula agendada no painel da mãe.

Se no futuro for necessário automatizar respostas ou confirmações, é possível evoluir para a **WhatsApp Business API** (Meta Cloud API ou provedores como Twilio/Z-API), mas isso exige aprovação de conta business e tem custo por mensagem.

## Como configurar o Mercado Pago (assinaturas)

O fluxo usa o produto **Assinaturas (Preapproval)**: a mãe assina um plano mensal, é redirecionada ao checkout do Mercado Pago, e a cobrança recorrente acontece automaticamente todo mês.

1. Crie/entre numa conta em https://www.mercadopago.com.br
2. Acesse o [painel de desenvolvedores](https://www.mercadopago.com.br/developers/panel/app) e crie uma aplicação
3. Copie o **Access Token** (use o de teste, que começa com `TEST-`, até validar o fluxo) em `MERCADOPAGO_ACCESS_TOKEN`
4. Configure o webhook (`/api/webhooks/mercadopago`) no painel de desenvolvedores, e copie a chave secreta para `MERCADOPAGO_WEBHOOK_SECRET`
5. Use um [usuário de teste comprador](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards) para simular a assinatura sem cobrança real
6. Em produção, troque `MERCADOPAGO_ACCESS_TOKEN` pelo token de produção

Os planos (nome, preço, aulas incluídas por mês) ficam na tabela `Plan` — edite por `prisma/seed.ts` ou `npx prisma studio`. Uma mãe só agenda aulas com assinatura `ATIVA`; se o plano tiver limite mensal, o agendamento é bloqueado ao atingir o limite. Trocar de plano cancela a assinatura anterior no Mercado Pago e cria uma nova automaticamente.

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

- Configure o webhook do Mercado Pago apontando para `https://SEU-SITE/api/webhooks/mercadopago`
- Configure o cron de lembretes (`vercel.json` já define o schedule) e garanta que `CRON_SECRET` está setado
- Todo `git push` em `main` publica uma nova versão automaticamente

## Roadmap

**Confiança/conversão**
- Selo de verificação/formação no perfil da professora
- Aviso de segurança sobre pagamento ("não pedimos pagamento fora da plataforma")
- FAQ com dúvidas comuns
- Pix como opção de pagamento (o Mercado Pago já suporta)

**Infraestrutura**
- Domínio próprio + verificação no Resend (hoje o envio de e-mail é limitado ao modo sandbox)
- Testes automatizados e CI (lint/build/test a cada push)
- Rate limiting em login, cadastro e recuperação de senha
- Monitoramento de erros em produção e analytics de conversão
