import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
};

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-serif-display text-3xl font-semibold text-primary-700">Termos de Uso</h1>
      <p className="mt-2 text-sm text-primary-700/60">
        Última atualização: 29 de julho de 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-primary-700/90">
        <p>
          Estes Termos de Uso regulam o acesso e a utilização do site
          Crianças em Foco (&quot;plataforma&quot;), que conecta mães e
          responsáveis a professoras especializadas em comportamento
          infantil para aulas particulares e orientação. Ao criar uma
          conta, você concorda com estes termos.
        </p>

        <section>
          <h2 className="text-lg font-bold text-primary-700">
            1. Natureza do serviço
          </h2>
          <p className="mt-2">
            A plataforma é um espaço de conexão entre mães/responsáveis e
            professoras autônomas que oferecem aulas e orientação sobre
            comportamento infantil. As aulas têm caráter pedagógico e de
            orientação familiar — <strong>não substituem</strong>{" "}
            acompanhamento médico, psicológico ou terapêutico
            especializado. Se a criança apresentar sinais de risco à saúde
            física ou mental, procure um profissional de saúde
            qualificado.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary-700">
            2. Cadastro e responsabilidade pelos dados
          </h2>
          <p className="mt-2">
            Você é responsável por fornecer informações verdadeiras,
            completas e atualizadas no cadastro, e por manter sua senha em
            sigilo. Contas de professora estão sujeitas à aprovação da
            nossa equipe antes de ficarem visíveis publicamente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary-700">
            3. Professoras
          </h2>
          <p className="mt-2">
            As professoras cadastradas atuam como profissionais autônomas,
            não como funcionárias da plataforma. A Crianças em Foco
            facilita o agendamento e o contato, mas a relação de prestação
            de serviço (conteúdo da aula, condução pedagógica) é entre a
            mãe/responsável e a professora.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary-700">
            4. Pagamentos
          </h2>
          <p className="mt-2">
            As aulas são pagas por PIX, diretamente para a professora, após o
            agendamento. A Crianças em Foco não processa nem armazena dados
            de pagamento — a chave PIX e o QR code exibidos no site
            pertencem à professora responsável pela aula.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary-700">
            5. Uso adequado
          </h2>
          <p className="mt-2">
            Não é permitido usar a plataforma para fins ilícitos, ofender
            outros usuários, tentar acessar contas alheias ou burlar os
            mecanismos de agendamento e cobrança. Contas que violarem
            estas regras podem ser suspensas.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary-700">
            6. Limitação de responsabilidade
          </h2>
          <p className="mt-2">
            A Crianças em Foco atua como intermediadora entre famílias e
            professoras, e envida esforços para verificar as professoras
            cadastradas, mas não garante resultados específicos das aulas
            nem se responsabiliza por condutas das professoras fora do
            escopo das aulas agendadas pela plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary-700">
            7. Alterações destes termos
          </h2>
          <p className="mt-2">
            Podemos atualizar estes termos periodicamente. Alterações
            relevantes serão comunicadas na plataforma. O uso continuado
            após a atualização representa concordância com os novos
            termos.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary-700">8. Contato</h2>
          <p className="mt-2">
            Dúvidas sobre estes termos podem ser enviadas para{" "}
            <a
              href="mailto:contato@criancasemfoco.com.br"
              className="font-semibold text-accent-600 hover:underline"
            >
              contato@criancasemfoco.com.br
            </a>{" "}
            ou pelo WhatsApp disponível no site.
          </p>
        </section>

        <p className="text-xs text-primary-700/60">
          Veja também a nossa{" "}
          <Link href="/privacidade" className="font-semibold underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
