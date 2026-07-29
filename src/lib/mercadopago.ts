import { MercadoPagoConfig, PreApproval } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ?? "",
});

export const preApprovalClient = new PreApproval(client);

export function mapMercadoPagoStatus(
  status: string | undefined
): "PENDENTE" | "ATIVA" | "PAUSADA" | "CANCELADA" {
  switch (status) {
    case "authorized":
      return "ATIVA";
    case "paused":
      return "PAUSADA";
    case "cancelled":
      return "CANCELADA";
    default:
      return "PENDENTE";
  }
}
