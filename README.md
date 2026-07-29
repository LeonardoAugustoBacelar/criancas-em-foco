# Crianças em Foco

Site para conectar mães que enfrentam desafios de comportamento com seus
filhos (em casa ou na escola) a professoras especializadas, com aulas,
agendamento, assinatura mensal e contato direto via WhatsApp.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://www.prisma.io) + PostgreSQL (via [Neon](https://neon.tech), driver adapter `@prisma/adapter-neon`)
- [NextAuth v5](https://authjs.dev) (login por e-mail/senha, papéis: mãe / professora / admin)
- Botão de WhatsApp (click-to-chat) flutuante + por professora + por aula agendada
- Assinaturas mensais via [Mercado Pago](https://www.mercadopago.com.br) (Preapproval / pagamento recorrente)
- Painel de administração para aprovar professoras e ver assinaturas

## Como rodar localmente

Você precisa de um banco Postgres (o mais simples é criar um projeto grátis
no [Neon](https://neon.tech) — veja o passo a passo completo na seção de
deploy abaixo, os primeiros 3 passos servem também só para desenvolvimento
local).

```bash
npm install
# cole a connection string do Neon em DATABASE_URL no .env
npx prisma migrate dev --name init   # cria as tabelas no banco
npm run db:seed                       # cria a professora Gilda, 1 mãe, 1 admin e os planos
npm run dev
```

Acesse http://localhost:3000

### Login de teste (criado pelo seed)

- Mãe: `mae.exemplo@criancasemfoco.com.br` / `senha123`
- Professora: `gilda@criancasemfoco.com.br` / `senha123`
- Admin: `admin@criancasemfoco.com.br` / `senha123`

## Variáveis de ambiente (`.env`)

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | Connection string do Postgres (Neon) |
| `AUTH_SECRET` | Chave usada pelo NextAuth para assinar sessões — troque em produção |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp da equipe/clínica (com DDI+DDD, só dígitos) usado no botão flutuante do site |
| `MERCADOPAGO_ACCESS_TOKEN` | Access token da sua conta Mercado Pago (produção ou teste) |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site, usada para montar o `back_url` do checkout e o webhook |

## Estrutura principal

- `src/app/page.tsx` — landing page (hero, serviços, professora em destaque, depoimentos)
- `src/app/professoras` — listagem e perfil da professora, com botão de WhatsApp e agendamento de aula
- `src/app/cadastro`, `src/app/login` — criação de conta (mãe ou professora) e login
- `src/app/dashboard` — painel: mães veem assinatura e aulas agendadas; professoras editam o próprio perfil, gerenciam horários e confirmam/cancelam solicitações
- `src/app/admin` — painel de administração (aprovar/suspender professoras, ver assinaturas)
- `src/app/planos` — planos de assinatura mensal, com botão que redireciona ao checkout do Mercado Pago
- `src/app/api/webhooks/mercadopago` — recebe notificações do Mercado Pago e atualiza o status da assinatura no banco
- `src/lib/actions` — Server Actions (cadastro, login, agendamento, disponibilidade, assinatura, perfil, admin)
- `prisma/schema.prisma` — modelos `User`, `TeacherProfile`, `Availability`, `Booking`, `Plan`, `Subscription`
- `prisma/seed.ts` — dados de exemplo (professora Gilda, mãe de teste, admin e 3 planos)

## Sobre a integração com WhatsApp

A integração atual é via **click-to-chat** (`https://wa.me/<número>?text=...`),
que não exige aprovação da Meta nem custos — funciona com qualquer número de
WhatsApp comum. Ela aparece em três lugares:

1. Botão flutuante no canto da tela, em todas as páginas (fala com a equipe/clínica)
2. Botão no perfil da professora (fala diretamente com ela, com mensagem
   pré-preenchida mencionando o nome dela)
3. Botão em cada aula agendada no painel da mãe (referencia a data/horário da aula)

Se no futuro for necessário automatizar respostas, lembretes de aula ou
confirmações automáticas, é possível evoluir para a **WhatsApp Business API**
(via Meta Cloud API ou provedores como Twilio/Z-API), mas isso exige
aprovação de conta business e tem custo por mensagem.

## Como configurar o Mercado Pago (assinaturas)

O fluxo usa o produto **Assinaturas (Preapproval)** do Mercado Pago: a mãe
assina um plano mensal, é redirecionada ao checkout do Mercado Pago, e a
cobrança recorrente acontece automaticamente todo mês.

1. Crie/entre numa conta em https://www.mercadopago.com.br
2. Acesse o [painel de desenvolvedores](https://www.mercadopago.com.br/developers/panel/app) e crie uma aplicação
3. Copie o **Access Token** (use o de teste, que começa com `TEST-`, até validar o fluxo) e coloque em `MERCADOPAGO_ACCESS_TOKEN`
4. Para o Mercado Pago conseguir chamar o webhook (`/api/webhooks/mercadopago`), a URL do site precisa ser pública — depois do deploy na Vercel isso já funciona automaticamente; para testar localmente antes do deploy, exponha o `localhost` com [ngrok](https://ngrok.com)
5. Use um [usuário de teste comprador](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards) para simular a assinatura sem cobrança real
6. Quando estiver pronto para produção, troque o `MERCADOPAGO_ACCESS_TOKEN` pelo token de produção

Os planos (nome, preço, aulas incluídas por mês) ficam na tabela `Plan` —
edite pelo `prisma/seed.ts` ou pelo `npx prisma studio`. Uma mãe só consegue
agendar aulas com assinatura `ATIVA`; se o plano tiver limite de aulas por
mês, o agendamento é bloqueado ao atingir o limite. Trocar de plano cancela
a assinatura anterior no Mercado Pago e cria uma nova automaticamente.

## Deploy (passo a passo)

### 1. Criar o banco Postgres no Neon

1. Crie uma conta em https://neon.tech (tem plano gratuito)
2. Crie um novo projeto (região São Paulo/`sa-east-1`, se disponível)
3. No painel do projeto, copie a **connection string** (formato
   `postgresql://usuario:senha@ep-xxxx.aws.neon.tech/neondb?sslmode=require`)
4. Cole essa string em `DATABASE_URL` no seu `.env` local
5. Rode `npx prisma migrate dev --name init` para criar as tabelas, depois
   `npm run db:seed` para os dados de exemplo (professora Gilda, planos, etc.)

### 2. Subir o código para o GitHub

O projeto já está preparado como repositório git local (primeiro commit
feito). Você só precisa criar o repositório remoto e enviar:

1. Crie uma conta em https://github.com (se ainda não tiver)
2. Crie um repositório novo, **vazio** (sem README/gitignore), ex:
   `criancas-em-foco`
3. No terminal, dentro da pasta do projeto:
   ```bash
   git remote add origin https://github.com/SEU-USUARIO/criancas-em-foco.git
   git branch -M main
   git push -u origin main
   ```

### 3. Importar na Vercel

1. Crie uma conta em https://vercel.com (pode entrar direto com o GitHub)
2. Clique em **Add New → Project** e selecione o repositório que você acabou de criar
3. A Vercel detecta que é Next.js automaticamente — não precisa mudar nada no build
4. Antes de clicar em "Deploy", abra **Environment Variables** e adicione:
   - `DATABASE_URL` — a mesma connection string do Neon
   - `AUTH_SECRET` — gere uma string aleatória (ex: rode `openssl rand -base64 32`)
   - `MERCADOPAGO_ACCESS_TOKEN` — o token do Mercado Pago
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` — o número real de WhatsApp da equipe
   - `NEXT_PUBLIC_SITE_URL` — a URL que a Vercel vai te dar (ex: `https://criancas-em-foco.vercel.app`) — se não souber ainda, coloque qualquer coisa, faça o primeiro deploy, copie a URL real gerada e atualize essa variável depois (a Vercel re-faz o deploy sozinha quando uma env var muda)
5. Clique em **Deploy**

Depois do primeiro deploy funcionando, se quiser um domínio próprio (ex:
`criancasemfoco.com.br`), isso é configurado em **Project Settings → Domains**
na própria Vercel.

### 4. Depois do deploy

- Configure o webhook do Mercado Pago apontando para
  `https://SEU-SITE.vercel.app/api/webhooks/mercadopago` no painel de
  desenvolvedores do Mercado Pago
- Todo `git push` na branch `main` faz a Vercel publicar automaticamente uma
  nova versão

## Próximos passos sugeridos

- Upload real de foto de perfil (hoje é só colar uma URL) — precisaria de um
  serviço de armazenamento, como Vercel Blob ou Cloudinary
- E-mails de notificação (confirmação/cancelamento de aula, cobrança) — precisa
  de um provedor como Resend ou SendGrid
- SEO básico (sitemap, meta tags por página, Google Analytics)
