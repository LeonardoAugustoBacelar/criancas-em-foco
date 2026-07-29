import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const { error } = await resend.emails.send({
    from: `Crianças em Foco <${FROM_EMAIL}>`,
    to,
    subject: "Redefinir sua senha — Crianças em Foco",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #235654;">Redefinir sua senha</h2>
        <p>Recebemos um pedido para redefinir a senha da sua conta no Crianças em Foco.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block; background:#ef7c4c; color:white; padding:12px 24px; border-radius:9999px; text-decoration:none; font-weight:bold;">
            Criar nova senha
          </a>
        </p>
        <p>Este link expira em 1 hora. Se você não pediu essa redefinição, pode ignorar este e-mail.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
