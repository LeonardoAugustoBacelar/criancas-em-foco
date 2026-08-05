import { describe, expect, it } from "vitest";
import {
  DOMICILIO_SCHEDULE_RULES,
  SCHEDULE_RULES,
  getDaySlots,
  isValidSlot,
  isWeekend,
} from "./schedule";

// 2026-08-04 é uma terça-feira (confirmado no projeto) — usado como âncora
// pros outros dias da semana abaixo. Construído com o construtor local
// (ano, mês 0-indexado, dia) pra não depender do fuso horário de quem roda
// o teste, diferente de `new Date("2026-08-08")` (UTC).
const TUESDAY = new Date(2026, 7, 4);
const WEDNESDAY = new Date(2026, 7, 5);
const SATURDAY = new Date(2026, 7, 8);
const SUNDAY = new Date(2026, 7, 9);

describe("isWeekend", () => {
  it("considera sábado e domingo como fim de semana", () => {
    expect(isWeekend(SATURDAY)).toBe(true);
    expect(isWeekend(SUNDAY)).toBe(true);
  });

  it("não considera dias de semana como fim de semana", () => {
    expect(isWeekend(TUESDAY)).toBe(false);
    expect(isWeekend(WEDNESDAY)).toBe(false);
  });
});

describe("getDaySlots (atendimento online)", () => {
  it("começa às 17h em dia de semana e termina antes das 20h", () => {
    const slots = getDaySlots(WEDNESDAY);
    expect(slots[0]).toEqual({ startTime: "17:00", endTime: "18:00" });
    expect(slots[slots.length - 1]).toEqual({
      startTime: "19:00",
      endTime: "20:00",
    });
    expect(slots).toHaveLength(3);
  });

  it("começa às 14h no fim de semana, com mais horários no dia", () => {
    const slots = getDaySlots(SATURDAY);
    expect(slots[0]).toEqual({ startTime: "14:00", endTime: "15:00" });
    expect(slots).toHaveLength(6);
  });
});

describe("getDaySlots (atendimento a domicílio)", () => {
  it("usa os mesmos horários do online — só o limite diário muda", () => {
    const online = getDaySlots(WEDNESDAY, SCHEDULE_RULES);
    const domicilio = getDaySlots(WEDNESDAY, DOMICILIO_SCHEDULE_RULES);
    expect(domicilio).toEqual(online);
  });

  it("o limite diário do domicílio é 1, bem menor que o do online (3)", () => {
    expect(DOMICILIO_SCHEDULE_RULES.maxBookingsPerDay).toBe(1);
    expect(SCHEDULE_RULES.maxBookingsPerDay).toBe(3);
  });
});

describe("isValidSlot", () => {
  it("aceita um horário que está na grade do dia", () => {
    expect(isValidSlot(WEDNESDAY, "17:00", "18:00")).toBe(true);
    expect(isValidSlot(SATURDAY, "14:00", "15:00")).toBe(true);
  });

  it("rejeita um horário fora da grade (antes do início)", () => {
    expect(isValidSlot(WEDNESDAY, "16:00", "17:00")).toBe(false);
  });

  it("rejeita um horário com duração errada (não bate com o slot)", () => {
    expect(isValidSlot(WEDNESDAY, "17:00", "17:30")).toBe(false);
  });

  it("rejeita um horário de dia de semana testado como se fosse fim de semana", () => {
    // 14h é válido no sábado, mas não numa quarta-feira comum.
    expect(isValidSlot(WEDNESDAY, "14:00", "15:00")).toBe(false);
  });
});
