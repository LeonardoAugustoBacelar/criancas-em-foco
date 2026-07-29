"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/#servicos", label: "Serviços" },
  { href: "/professoras", label: "Professoras" },
  { href: "/planos", label: "Planos" },
  { href: "/#depoimentos", label: "Como trabalhamos" },
  { href: "/#contato", label: "Contato" },
];

export default function MobileNav({
  isAuthed,
  signOutAction,
}: {
  isAuthed: boolean;
  signOutAction: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        className="flex h-10 w-10 items-center justify-center rounded-full text-primary-700 hover:bg-primary-100"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-primary-100 bg-cream px-4 pb-6 pt-2 shadow-lg sm:px-6">
          <nav className="flex flex-col gap-1 text-sm font-medium text-primary-700">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 hover:bg-primary-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-2 border-t border-primary-100 pt-4">
            {isAuthed ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-full px-4 py-2.5 text-center text-sm font-semibold text-primary-700 hover:bg-primary-100"
                >
                  Minha área
                </Link>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="w-full rounded-full border border-primary-300 px-4 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-100"
                  >
                    Sair
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-full px-4 py-2.5 text-center text-sm font-semibold text-primary-700 hover:bg-primary-100"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-accent-500 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-accent-600"
                >
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
