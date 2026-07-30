import { Phone } from "lucide-react";

export default function CallButton({
  phone,
  className = "",
}: {
  phone: string;
  className?: string;
}) {
  const digits = phone.replace(/\D/g, "");

  return (
    <a
      href={`tel:+${digits}`}
      className={`btn-press inline-flex items-center justify-center gap-2 rounded-md border border-primary-100 px-5 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50 ${className}`}
    >
      <Phone className="h-4 w-4" />
      Ligar
    </a>
  );
}
