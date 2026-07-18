import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

describe("EB02 Stage parser grammar", () => {
  test("redistributes currently given DON!! without requiring the word total", () => {
    expect(
      buildCardEffects(
        '[Activate: Main] You may rest this Stage: Give up to 1 of your currently given DON!! cards to 1 of your "Straw Hat Crew" type Characters.',
      )?.effects,
    ).toEqual([
      {
        trigger: "activateMain",
        costs: [{ cost: "restThisCard" }],
        actions: [
          {
            action: "redistributeDon",
            count: { amount: 1, upTo: true },
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              filters: [{ filter: "trait", value: "Straw Hat Crew", match: "includes" }],
            },
          },
        ],
        optional: true,
      },
    ]);
  });
});
