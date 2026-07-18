import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP02-027 Inuarashi parser regression", () => {
  test("maps the all-DON-rested gate and opponent-effect removal protection", () => {
    expect(
      buildCardEffects(
        "If all of your DON!! cards are rested, this Character cannot be removed from the field by your opponent's effects.",
      ),
    ).toEqual({
      permanentEffects: [
        {
          conditions: [
            {
              condition: "compound",
              operator: "and",
              conditions: [
                {
                  condition: "activeDonCount",
                  comparison: "eq",
                  value: 0,
                },
                {
                  condition: "givenDonCount",
                  player: "self",
                  comparison: "eq",
                  value: 0,
                },
              ],
            },
          ],
          actions: [
            {
              action: "cannotBeRemoved",
              target: {
                player: "self",
                zones: ["field"],
                count: {
                  amount: 1,
                },
                self: true,
              },
              duration: "permanent",
              bySource: "opponentEffect",
            },
          ],
        },
      ],
    });
  });
});
