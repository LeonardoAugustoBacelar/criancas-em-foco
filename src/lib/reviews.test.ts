import { describe, expect, it } from "vitest";
import { summarizeRatings } from "./reviews";

describe("summarizeRatings", () => {
  it("retorna média 0 e contagem 0 sem avaliações", () => {
    expect(summarizeRatings([])).toEqual({ average: 0, count: 0 });
  });

  it("calcula a média corretamente com várias avaliações", () => {
    const result = summarizeRatings([
      { rating: 5 },
      { rating: 4 },
      { rating: 3 },
    ]);
    expect(result.count).toBe(3);
    expect(result.average).toBeCloseTo(4, 5);
  });

  it("uma única avaliação vira a própria média", () => {
    expect(summarizeRatings([{ rating: 5 }])).toEqual({
      average: 5,
      count: 1,
    });
  });
});
