import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP11-046 and OP11-050 shared grammar", () => {
  test("keeps the only-GERMA condition on opponent-effect K.O. and rest protection", () => {
    expect(
      buildCardEffects(
        "[Blocker]\nIf you only have Characters with a type including \"GERMA\", this Character cannot be K.O.'d or rested by your opponent's effects.",
      ),
    ).toEqual({
      keywords: ["blocker"],
      permanentEffects: [
        {
          conditions: [
            {
              condition: "zoneCount",
              player: "self",
              zone: "character",
              comparison: "eq",
              value: 0,
              filters: [
                {
                  filter: "trait",
                  value: "GERMA",
                  match: "includes",
                  negate: true,
                },
              ],
            },
          ],
          actions: [
            {
              action: "cannotBeKod",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              duration: "permanent",
              restriction: "byEffect",
              byPlayer: "opponent",
            },
            {
              action: "cannotBeRested",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              duration: "permanent",
              byPlayer: "opponent",
            },
          ],
        },
      ],
    });
  });

  test("parses a filtered hand cost followed by a hand-or-deck removal choice", () => {
    const block = buildCardEffects(
      '[When Attacking] You may trash 1 "Firetank Pirates" type card from your hand: Return up to 1 Character with a cost of 1 or less to the owner\'s hand or place it at the bottom of their deck.',
    )?.effects?.[0];

    expect(block).toMatchObject({
      trigger: "whenAttacking",
      optional: true,
      costs: [
        {
          cost: "trashFromHand",
          amount: 1,
          filters: [{ filter: "trait", value: "Firetank Pirates", match: "includes" }],
        },
      ],
      actions: [
        {
          action: "choice",
          options: [[{ action: "returnToHand" }], [{ action: "returnToDeck", position: "bottom" }]],
        },
      ],
    });
  });
});
