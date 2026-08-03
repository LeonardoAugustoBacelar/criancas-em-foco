// Regras fixas de horário do Crianças em Foco: aulas de 1h, começando às
// 17h em dias de semana e às 14h em finais de semana, até as 20h, com no
// máximo 3 aulas por dia (capacidade da professora).

export const SCHEDULE_RULES = {
  weekdayStart: "17:00",
  weekendStart: "14:00",
  end: "20:00",
  slotDurationMinutes: 60,
  maxBookingsPerDay: 3,
} as const;

export type TimeSlot = { startTime: string; endTime: string };

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/** Todos os horários possíveis (independente de reserva) para uma data. */
export function getDaySlots(date: Date): TimeSlot[] {
  const start = isWeekend(date)
    ? SCHEDULE_RULES.weekendStart
    : SCHEDULE_RULES.weekdayStart;
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(SCHEDULE_RULES.end);

  const slots: TimeSlot[] = [];
  for (
    let minutes = startMinutes;
    minutes + SCHEDULE_RULES.slotDurationMinutes <= endMinutes;
    minutes += SCHEDULE_RULES.slotDurationMinutes
  ) {
    slots.push({
      startTime: minutesToTime(minutes),
      endTime: minutesToTime(minutes + SCHEDULE_RULES.slotDurationMinutes),
    });
  }
  return slots;
}

export function isValidSlot(date: Date, startTime: string, endTime: string): boolean {
  return getDaySlots(date).some(
    (slot) => slot.startTime === startTime && slot.endTime === endTime
  );
}
