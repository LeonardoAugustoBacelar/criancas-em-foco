import Image from "next/image";
import { getPixQrCodeDataUrl, PIX_CONFIG } from "@/lib/pix";
import PixKeyCopy from "@/components/PixKeyCopy";

export default async function PixPaymentInfo() {
  const qrCodeDataUrl = await getPixQrCodeDataUrl();

  return (
    <div className="rounded-lg border border-primary-100 bg-white p-6">
      <p className="font-bold text-primary-700">Pagamento via PIX</p>
      <p className="mt-1 text-sm text-primary-700/80">
        Depois de agendar, pague a aula direto para a professora — escaneie o
        QR code ou copie a chave abaixo.
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
    </div>
  );
}
