import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function WhatsAppInlineButton({
  phone,
  message,
  label = "Falar no WhatsApp",
  className = "",
}: {
  phone: string;
  message: string;
  label?: string;
  className?: string;
}) {
  const href = buildWhatsAppLink(phone, message);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1fb857] ${className}`}
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M16.004 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.6 4.44 1.73 6.36L3.2 28.8l6.62-1.7a12.7 12.7 0 0 0 6.18 1.58h.005c7.07 0 12.8-5.73 12.8-12.8s-5.73-12.68-12.8-12.68zm0 23.35h-.004a10.5 10.5 0 0 1-5.36-1.47l-.385-.23-3.93 1.01 1.05-3.83-.25-.4a10.44 10.44 0 0 1-1.6-5.6c0-5.8 4.72-10.52 10.53-10.52 2.81 0 5.45 1.1 7.44 3.09a10.44 10.44 0 0 1 3.08 7.45c0 5.8-4.72 10.47-10.55 10.47zm5.77-7.84c-.315-.16-1.86-.92-2.15-1.02-.29-.11-.5-.16-.71.16-.21.31-.815 1.02-1 1.23-.185.21-.37.24-.685.08-.315-.16-1.33-.49-2.53-1.56-.935-.83-1.565-1.86-1.75-2.17-.185-.31-.02-.48.14-.63.14-.14.315-.37.47-.55.16-.19.21-.31.315-.52.105-.21.05-.4-.025-.55-.075-.16-.71-1.71-.975-2.34-.255-.62-.52-.53-.71-.54-.185-.01-.4-.01-.605-.01a1.16 1.16 0 0 0-.84.4c-.29.31-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.75.75.32 1.34.52 1.8.66.755.24 1.44.21 1.98.13.605-.09 1.86-.76 2.12-1.5.265-.74.265-1.37.185-1.5-.08-.13-.29-.21-.605-.37z" />
      </svg>
      {label}
    </a>
  );
}
