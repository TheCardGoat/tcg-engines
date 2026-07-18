import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("variable return-DON!! costs", () => {
  test("maps 'return 1 or more' to a minimum-bound activation cost", () => {
    expect(
      buildCardEffects(
        "[On Play] You may return 1 or more DON!! cards from your field to your DON!! deck: Draw 1 card.",
      )?.effects?.[0],
    ).toMatchObject({
      trigger: "onPlay",
      optional: true,
      costs: [{ cost: "returnDon", minimumAmount: 1 }],
      actions: [{ action: "draw", amount: 1 }],
    });
  });

  test("preserves fixed DON!! return costs as exact amounts", () => {
    expect(buildCardEffects("[On Play] DON!! −2: Draw 1 card.")?.effects?.[0]).toMatchObject({
      costs: [{ cost: "returnDon", amount: 2 }],
      actions: [{ action: "draw", amount: 1 }],
    });
  });
});
