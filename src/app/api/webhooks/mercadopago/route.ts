import { NextRequest, NextResponse } from "next/server";
import { WebhookSignatureValidator, InvalidWebhookSignatureError } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { preApprovalClient, mapMercadoPagoStatus } from "@/lib/mercadopago";

function verifySignature(request: NextRequest): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) {
    console.error(
      "MERCADOPAGO_WEBHOOK_SECRET não configurado — recusando notificação do Mercado Pago."
    );
    return false;
  }

  const dataId = request.nextUrl.searchParams.get("data.id") ?? request.nextUrl.searchParams.get("id");

  try {
    WebhookSignatureValidator.validate({
      xSignature: request.headers.get("x-signature"),
      xRequestId: request.headers.get("x-request-id"),
      dataId: dataId?.toLowerCase(),
      secret,
      toleranceSeconds: 300,
    });
    return true;
  } catch (error) {
    if (error instanceof InvalidWebhookSignatureError) {
      console.error(
        `Assinatura inválida no webhook do Mercado Pago: ${error.reason}`,
        { requestId: error.requestId }
      );
    } else {
      console.error("Erro ao validar assinatura do webhook do Mercado Pago", error);
    }
    return false;
  }
}

function extractPreapprovalId(request: NextRequest, body: unknown): string | null {
  const searchParams = request.nextUrl.searchParams;
  const queryId = searchParams.get("data.id") ?? searchParams.get("id");
  const topic = searchParams.get("type") ?? searchParams.get("topic");

  if (queryId && (!topic || topic.includes("preapproval"))) {
    return queryId;
  }

  if (body && typeof body === "object") {
    const payload = body as {
      type?: string;
      data?: { id?: string };
    };
    if (payload.type?.includes("preapproval") && payload.data?.id) {
      return payload.data.id;
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  if (!verifySignature(request)) {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
  }

  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const preapprovalId = extractPreapprovalId(request, body);

  if (!preapprovalId) {
    return NextResponse.json({ received: true });
  }

  try {
    const preapproval = await preApprovalClient.get({ id: preapprovalId });
    const status = mapMercadoPagoStatus(preapproval.status);

    await prisma.subscription.updateMany({
      where: { mpPreapprovalId: preapprovalId },
      data: { status },
    });
  } catch (error) {
    console.error("Erro ao processar webhook do Mercado Pago", error);
  }

  return NextResponse.json({ received: true });
}
