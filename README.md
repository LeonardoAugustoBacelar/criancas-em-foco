# Crianças em Foco

Site para conectar mães que enfrentam desafios de comportamento com seus
filhos (em casa ou na escola) a professoras especializadas, com aulas,
agendamento e contato direto via WhatsApp.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://www.prisma.io) + SQLite (via driver adapter `better-sqlite3`)
- [NextAuth v5](https://authjs.dev) (login por e-mail/senha, papéis: mãe / professora)
- Botão de WhatsApp (click-to-chat) flutuante + por professora + por aula agendada
- Assinaturas mensais via [Mercado Pago](https://www.mercadopago.com.br) (Preapproval / pagamento recorrente)

## Como rodar localmente

```bash
npm install
npx prisma migrate dev   # cria o banco SQLite local (dev.db)
npm run db:seed          # cria 3 professoras e 1 mãe de exemplo
npm run dev
```

Acesse http://localhost:3000

### Login de teste (criado pelo seed)

- Mãe: `mae.exemplo@criancasemfoco.com.br` / `senha123`
- Professoras: `fernanda@`, `juliana@`, `patricia@criancasemfoco.com.br` / `senha123`

## Variáveis de ambiente (`.env`)

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | Caminho do banco SQLite (padrão `file:./dev.db`) |
| `AUTH_SECRET` | Chave usada pelo NextAuth para assinar sessões — troque em produção |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp da equipe/clínica (com DDI+DDD, só dígitos) usado no botão flutuante do site |
| `MERCADOPAGO_ACCESS_TOKEN` | Access token da sua conta Mercado Pago (produção ou teste) |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site, usada para montar o `back_url` do checkout |

## Estrutura principal

- `src/app/page.tsx` — landing page (hero, serviços, professoras em destaque, depoimentos)
- `src/app/professoras` — listagem e perfil de cada professora, com botão de WhatsApp e agendamento de aula
- `src/app/cadastro`, `src/app/login` — criação de conta (mãe ou professora) e login
- `src/app/dashboard` — painel: mães veem suas aulas agendadas; professoras gerenciam horários disponíveis e confirmam/cancelam solicitações
- `src/app/planos` — planos de assinatura mensal, com botão que redireciona ao checkout do Mercado Pago
- `src/app/api/webhooks/mercadopago` — recebe notificações do Mercado Pago e atualiza o status da assinatura no banco
- `src/lib/actions` — Server Actions (cadastro, login, agendamento, disponibilidade, assinatura)
- `prisma/schema.prisma` — modelos `User`, `TeacherProfile`, `Availability`, `Booking`, `Plan`, `Subscription`
- `prisma/seed.ts` — dados de exemplo (professoras, mãe de teste e 3 planos)

## Sobre a integração com WhatsApp

A integração atual é via **click-to-chat** (`https://wa.me/<número>?text=...`),
que não exige aprovação da Meta nem custos — funciona com qualquer número de
WhatsApp comum. Ela aparece em três lugares:

1. Botão flutuante no canto da tela, em todas as páginas (fala com a equipe/clínica)
2. Botão no perfil de cada professora (fala diretamente com ela, com mensagem
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
3. Copie o **Access Token de teste** (começa com `TEST-`) e coloque em `MERCADOPAGO_ACCESS_TOKEN` no `.env`
4. Para testar o fluxo completo localmente, o Mercado Pago precisa conseguir
   chamar o seu webhook (`/api/webhooks/mercadopago`), então é preciso expor
   o `localhost` com algo como [ngrok](https://ngrok.com) e configurar essa
   URL pública em "Webhooks" no painel do app, além de ajustar
   `NEXT_PUBLIC_SITE_URL` para a URL do ngrok
5. Use um [usuário de teste comprador](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards) para simular a assinatura sem cobrança real
6. Quando estiver pronto para produção, troque o `MERCADOPAGO_ACCESS_TOKEN` pelo token de produção e ative os webhooks na URL real do site

Os planos (nome, preço, aulas incluídas por mês) ficam na tabela `Plan` —
edite pelo `prisma/seed.ts` ou pelo `npx prisma studio`. Uma mãe só consegue
agendar aulas com assinatura `ATIVA`; se o plano tiver limite de aulas por
mês, o agendamento é bloqueado ao atingir o limite.

## Próximos passos sugeridos

- Upload de foto de perfil das professoras
- E-mails de notificação (confirmação/cancelamento de aula, cobrança)
- Painel de administração para aprovar novas professoras
- Página para trocar/fazer upgrade de plano
