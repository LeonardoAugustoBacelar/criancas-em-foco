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
        <h2 style="color: #18181b;">Redefinir sua senha</h2>
        <p>Recebemos um pedido para redefinir a senha da sua conta no Crianças em Foco.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block; background:#18181b; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">
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

export async function sendBookingReminderEmail(
  to: string,
  data: {
    childName: string;
    teacherName: string;
    date: string;
    startTime: string;
    whatsappUrl: string;
  }
) {
  const { error } = await resend.emails.send({
    from: `Crianças em Foco <${FROM_EMAIL}>`,
    to,
    subject: `Lembrete: aula de ${data.childName} amanhã às ${data.startTime}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #18181b;">Sua aula é amanhã</h2>
        <p>
          Passando para lembrar que ${data.childName} tem aula com
          <strong>${data.teacherName}</strong> amanhã, dia ${data.date}, às
          <strong>${data.startTime}</strong>.
        </p>
        <p>
          <a href="${data.whatsappUrl}" style="display:inline-block; background:#18181b; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">
            Falar com a professora
          </a>
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
