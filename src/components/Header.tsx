import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-primary-100 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-lg font-bold text-white">
            CF
          </span>
          <span className="text-lg font-bold text-primary-700">
            Crianças em Foco
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-primary-700 md:flex">
          <Link href="/#servicos" className="hover:text-accent-600">
            Serviços
          </Link>
          <Link href="/professoras" className="hover:text-accent-600">
            Professoras
          </Link>
          <Link href="/planos" className="hover:text-accent-600">
            Planos
          </Link>
          <Link href="/#depoimentos" className="hover:text-accent-600">
            Como trabalhamos
          </Link>
          <Link href="/#contato" className="hover:text-accent-600">
            Contato
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-100"
              >
                Minha área
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="rounded-full border border-primary-300 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-100"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-100 sm:block"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
