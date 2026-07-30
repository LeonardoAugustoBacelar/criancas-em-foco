import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
};

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-primary-700">
        Política de Privacidade
      </h1>
      <p className="mt-2 text-sm text-primary-700/60">
        Última atualização: 29 de julho de 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-primary-700/90">
        <p>
          Esta política explica como a Crianças em Foco coleta, usa e
          protege dados pessoais, em conformidade com a Lei Geral de
          Proteção de Dados (LGPD — Lei 13.709/2018).
        </p>

        <section>
          <h2 className="text-lg font-bold text-primary-700">
            1. Quais dados coletamos
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Dados de cadastro:</strong> nome, e-mail, telefone e
              senha (armazenada de forma criptografada, nunca em texto
              simples).
            </li>
            <li>
              <strong>Dados de professoras:</strong> bio, especialidades,
              WhatsApp e valor da hora/aula, exibidos publicamente no
              perfil.
            </li>
            <li>
              <strong>Dados de agendamento:</strong> nome da criança, data,
              horário e observações que a mãe/responsável opte por
              informar sobre a aula.
            </li>
            <li>
              <strong>Dados de pagamento:</strong> processados diretamente
              pelo Mercado Pago — não temos acesso nem armazenamos número
              de cartão de crédito.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary-700">
            2. Dados de crianças
          </h2>
          <p className="mt-2">
            Não coletamos dados diretamente de crianças. O nome da criança
            e eventuais observações sobre a aula são fornecidos
            voluntariamente pela mãe/responsável legal, exclusivamente
            para viabilizar o agendamento e a comunicação com a
            professora. Recomendamos não incluir informações sensíveis de
            saúde detalhadas nos campos de observação — se precisar
            compartilhar esse tipo de informação, prefira fazer
            diretamente com a professora, pelo WhatsApp.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary-700">
            3. Finalidade e base legal
          </h2>
          <p className="mt-2">
            Usamos seus dados para: criar e gerenciar sua conta, viabilizar
            o agendamento de aulas, processar assinaturas, e permitir
            contato via WhatsApp entre mãe e professora. A base legal é a
            execução do contrato de uso da plataforma e o seu
            consentimento, dado no momento do cadastro.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary-700">
            4. Compartilhamento com terceiros
          </h2>
          <p className="mt-2">
            Compartilhamos dados apenas com prestadores essenciais ao
            funcionamento do serviço:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Mercado Pago</strong> — processamento de pagamentos e
              assinaturas.
            </li>
            <li>
              <strong>Vercel</strong> — hospedagem da aplicação.
            </li>
            <li>
              <strong>Neon</strong> — hospedagem do banco de dados.
            </li>
          </ul>
          <p className="mt-2">
            Não vendemos nem compartilhamos seus dados para fins
            publicitários de terceiros.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary-700">
            5. Seus direitos (LGPD)
          </h2>
          <p className="mt-2">
            Você pode, a qualquer momento, solicitar: confirmação de que
            tratamos seus dados, acesso aos dados, correção de dados
            incompletos ou desatualizados, exclusão dos dados, portabilidade
            e revogação do consentimento. Para exercer esses direitos,
            entre em contato pelo e-mail{" "}
            <a
              href="mailto:contato@criancasemfoco.com.br"
              className="font-semibold text-accent-600 hover:underline"
            >
              contato@criancasemfoco.com.br
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary-700">
            6. Retenção e segurança
          </h2>
          <p className="mt-2">
            Mantemos seus dados enquanto sua conta estiver ativa ou pelo
            tempo necessário para cumprir obrigações legais. Senhas são
            armazenadas com hash criptográfico e a comunicação com o site
            é feita via HTTPS.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary-700">
            7. Cookies
          </h2>
          <p className="mt-2">
            Usamos apenas cookies essenciais para manter sua sessão de
            login. Não usamos cookies de rastreamento publicitário de
            terceiros.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary-700">
            8. Alterações desta política
          </h2>
          <p className="mt-2">
            Podemos atualizar esta política periodicamente. A data da
            última atualização está sempre indicada no topo desta página.
          </p>
        </section>

        <p className="text-xs text-primary-700/60">
          Veja também os nossos{" "}
          <Link href="/termos" className="font-semibold underline">
            Termos de Uso
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
