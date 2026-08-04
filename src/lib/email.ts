import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER ?? "";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD ?? "";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
});

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await transporter.sendMail({
    from: `Florescer Kids <${GMAIL_USER}>`,
    to,
    subject: "Redefinir sua senha — Florescer Kids",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #18181b;">Redefinir sua senha</h2>
        <p>Recebemos um pedido para redefinir a senha da sua conta no Florescer Kids.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block; background:#18181b; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">
            Criar nova senha
          </a>
        </p>
        <p>Este link expira em 1 hora. Se você não pediu essa redefinição, pode ignorar este e-mail.</p>
      </div>
    `,
  });
}

export async function sendBookingReminderEmail(
  to: string,
  data: {
    childName: string;
    teacherName: string;
    date: string;
    startTime: string;
    whatsappUrl: string;
    videoCallLink?: string | null;
  }
) {
  await transporter.sendMail({
    from: `Florescer Kids <${GMAIL_USER}>`,
    to,
    subject: `Lembrete: aula de ${data.childName} amanhã às ${data.startTime}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #18181b;">Sua aula é amanhã</h2>
        <p>
          Passando para lembrar que ${data.childName} tem aula (online) com
          <strong>${data.teacherName}</strong> amanhã, dia ${data.date}, às
          <strong>${data.startTime}</strong>.
        </p>
        ${
          data.videoCallLink
            ? `<p>
                <a href="${data.videoCallLink}" style="display:inline-block; background:#2f6f6b; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">
                  Entrar na videochamada
                </a>
              </p>`
            : ""
        }
        <p>
          <a href="${data.whatsappUrl}" style="display:inline-block; background:#18181b; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">
            Falar com a professora
          </a>
        </p>
      </div>
    `,
  });
}
