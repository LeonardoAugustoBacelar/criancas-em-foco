import Image from "next/image";
import { getPixQrCodeDataUrl, PIX_CONFIG } from "@/lib/pix";
import PixKeyCopy from "@/components/PixKeyCopy";

export default async function PixPaymentInfo({
  amount = PIX_CONFIG.amount,
}: {
  amount?: number;
}) {
  const qrCodeDataUrl = await getPixQrCodeDataUrl(amount);

  return (
    <div className="rounded-lg border border-primary-100 bg-white p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-bold text-primary-700">Pagamento via PIX</p>
        <p className="text-lg font-bold text-accent-600">
          R$ {amount.toFixed(2)}
        </p>
      </div>
      <p className="mt-1 text-sm text-primary-700/80">
        Depois de agendar, pague a aula direto para a professora — escaneie o
        QR code (já vem com o valor preenchido) ou copie a chave abaixo.
      </p>

      <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-md border border-primary-100">
          <Image
            src={qrCodeDataUrl}
            alt="QR code para pagamento via PIX"
            fill
            unoptimized
          />
        </div>
        <div className="w-full space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-700/60">
            Chave PIX (telefone)
          </p>
          <PixKeyCopy value={PIX_CONFIG.key} />
          <p className="text-xs text-primary-700/60">
            Recebedor: {PIX_CONFIG.name} — {PIX_CONFIG.city}
          </p>
        </div>
      </div>

      <p className="mt-5 rounded-md bg-primary-50 p-3 text-xs text-primary-700/80">
        Depois de pagar, envie o comprovante pelo WhatsApp para confirmar sua
        vaga — o link aparece assim que você agenda a aula.
      </p>

      <p className="mt-2 text-xs text-primary-700/60">
        Pode cancelar ou remarcar quando quiser, sem multa, direto no seu
        painel — só avise a professora com antecedência. Se já tiver pago e
        precisar cancelar, combine o reembolso ou reagendamento com ela pelo
        WhatsApp.
      </p>
    </div>
  );
}
