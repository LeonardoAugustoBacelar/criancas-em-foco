import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { preApprovalClient, mapMercadoPagoStatus } from "@/lib/mercadopago";

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
