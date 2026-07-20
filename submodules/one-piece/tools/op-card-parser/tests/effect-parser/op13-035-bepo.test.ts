import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP13-035 Bepo", () => {
  test("keeps the end-turn choice between this Character and up to one DON!!", () => {
    expect(
      buildCardEffects(
        "[End of Your Turn] Set this Character or up to 1 of your DON!! cards as active.",
      )?.effects?.[0],
    ).toMatchObject({
      trigger: "endOfYourTurn",
      actions: [
        {
          action: "choice",
          options: [
            [
              {
                action: "setActive",
                target: { player: "self", zones: ["character"], self: true },
              },
            ],
            [
              {
                action: "setActive",
                target: {
                  player: "self",
                  zones: ["costArea"],
                  count: { amount: 1, upTo: true },
                },
              },
            ],
          ],
        },
      ],
    });
  });
});
