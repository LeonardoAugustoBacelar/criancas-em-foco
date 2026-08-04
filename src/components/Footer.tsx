import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import {
  buildWhatsAppLink,
  CLINIC_WHATSAPP,
  DEFAULT_WHATSAPP_MESSAGE,
} from "@/lib/whatsapp";

export default function Footer() {
  const whatsappHref = buildWhatsAppLink(CLINIC_WHATSAPP, DEFAULT_WHATSAPP_MESSAGE);

  return (
    <footer id="contato" className="border-t border-primary-600 bg-primary-700 text-primary-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-sm font-bold text-white">
              FK
            </span>
            <p className="text-lg font-bold text-white">Florescer Kids</p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-primary-100">
            Apoio especializado para mães que enfrentam desafios de
            comportamento com seus filhos, em casa ou na escola. Aulas e
            acompanhamento com professoras especializadas.
          </p>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-400">
            Navegação
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-100">
            <li>
              <Link href="/professoras" className="transition hover:text-white">
                Professoras
              </Link>
            </li>
            <li>
              <Link href="/horarios" className="transition hover:text-white">
                Horários
              </Link>
            </li>
            <li>
              <Link href="/cadastro" className="transition hover:text-white">
                Criar conta
              </Link>
            </li>
            <li>
              <Link href="/login" className="transition hover:text-white">
                Entrar
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-400">
            Contato
          </p>
          <ul className="mt-4 space-y-3 text-sm text-primary-100">
            <li>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition hover:text-white"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                Falar no WhatsApp
              </a>
            </li>
            <li>
              <a
                href="mailto:florescerkiids@gmail.com"
                className="flex items-center gap-2 transition hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0" />
                florescerkiids@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-primary-100/70 sm:px-6">
        <p>
          © {new Date().getFullYear()} Florescer Kids. Todos os direitos
          reservados.
        </p>
        <p className="mt-1.5">
          <Link href="/termos" className="hover:text-white hover:underline">
            Termos de Uso
          </Link>{" "}
          ·{" "}
          <Link
            href="/privacidade"
            className="hover:text-white hover:underline"
          >
            Política de Privacidade
          </Link>
        </p>
      </div>
    </footer>
  );
}
