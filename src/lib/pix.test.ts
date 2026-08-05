import { describe, expect, it } from "vitest";
import { buildPixPayload, PIX_CONFIG } from "./pix";

// Mesmo algoritmo de src/lib/pix.ts (CRC-16/CCITT-FALSE), reimplementado
// aqui de propósito — o teste não deve importar a função interna do
// arquivo testado, senão um bug no cálculo do CRC nunca seria pego (o
// teste "concordaria" com o próprio bug).
function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) !== 0 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/** Faz o parse manual dos campos TLV (id + tamanho de 2 dígitos + valor) do BR Code. */
function parseTlv(payload: string): Map<string, string> {
  const fields = new Map<string, string>();
  let i = 0;
  while (i < payload.length) {
    const id = payload.slice(i, i + 2);
    const length = Number(payload.slice(i + 2, i + 4));
    const value = payload.slice(i + 4, i + 4 + length);
    fields.set(id, value);
    i += 4 + length;
  }
  return fields;
}

describe("buildPixPayload", () => {
  it("gera um payload cujo CRC-16 bate com o recalculado de forma independente", () => {
    const payload = buildPixPayload(60);
    const withoutCrc = payload.slice(0, -4);
    const crcInPayload = payload.slice(-4);
    expect(crcInPayload).toBe(crc16(withoutCrc));
  });

  it("estrutura TLV é válida e contém a chave PIX correta", () => {
    const payload = buildPixPayload(60);
    const fields = parseTlv(payload.slice(0, -8)); // sem o campo 63 (CRC) pra simplificar

    expect(fields.get("00")).toBe("01"); // Payload Format Indicator
    expect(fields.get("01")).toBe("11"); // estático, reutilizável

    const merchantAccountInfo = fields.get("26");
    expect(merchantAccountInfo).toContain(PIX_CONFIG.keyFormatted);
    expect(merchantAccountInfo).toContain("br.gov.bcb.pix");

    expect(fields.get("59")).toBe(PIX_CONFIG.name);
    expect(fields.get("60")).toBe(PIX_CONFIG.city);
    expect(fields.get("53")).toBe("986"); // BRL
  });

  it("inclui o valor da transação formatado com duas casas decimais", () => {
    const payload = buildPixPayload(90);
    // Campo EMV 54 (valor): id "54" + tamanho "05" (5 caracteres em "90.00") + o valor.
    expect(payload).toContain("540590.00");
  });

  it("valores diferentes (online vs. domicílio) geram payloads diferentes", () => {
    const online = buildPixPayload(60);
    const domicilio = buildPixPayload(90);
    expect(online).not.toBe(domicilio);
  });

  it("omite o campo de valor quando amount é 0 (QR sem valor pré-definido)", () => {
    const payload = buildPixPayload(0);
    const fields = parseTlv(payload.slice(0, -8));
    expect(fields.has("54")).toBe(false);
  });
});
