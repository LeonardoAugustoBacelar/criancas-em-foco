export function buildWhatsAppLink(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}

export const CLINIC_WHATSAPP =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511999999999";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Olá! Encontrei o site Crianças em Foco e gostaria de saber mais sobre como vocês podem ajudar meu filho(a).";
