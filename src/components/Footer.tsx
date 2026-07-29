import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contato" className="border-t border-primary-100 bg-primary-700 text-primary-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">Crianças em Foco</p>
          <p className="mt-3 text-sm text-primary-100">
            Apoio especializado para mães que enfrentam desafios de
            comportamento com seus filhos, em casa ou na escola. Aulas e
            acompanhamento com professoras especializadas.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-400">
            Navegação
          </p>
          <ul className="mt-3 space-y-2 text-sm text-primary-100">
            <li>
              <Link href="/professoras" className="hover:text-white">
                Professoras
              </Link>
            </li>
            <li>
              <Link href="/cadastro" className="hover:text-white">
                Criar conta
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white">
                Entrar
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-400">
            Contato
          </p>
          <ul className="mt-3 space-y-2 text-sm text-primary-100">
            <li>WhatsApp: use o botão flutuante no canto da tela</li>
            <li>contato@criancasemfoco.com.br</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-primary-200 sm:px-6">
        © {new Date().getFullYear()} Crianças em Foco. Todos os direitos reservados.
      </div>
    </footer>
  );
}
