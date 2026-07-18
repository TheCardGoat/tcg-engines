import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP06-025/028/029/031 fast-lane parser regressions", () => {
  test("OP06-025 searches Fish-Man or Merfolk included traits other than Camie", () => {
    expect(
      buildCardEffects(
        '[On Play] Look at 4 cards from the top of your deck; reveal up to 1 "Fish-Man" or "Merfolk" type card other than [Camie] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "search",
              lookCount: 4,
              source: { player: "self", zone: "deck" },
              revealCount: { amount: 1, upTo: true },
              revealFilters: [
                { filter: "excludeName", value: "Camie" },
                {
                  filter: "anyOf",
                  filters: [
                    { filter: "trait", value: "Fish-Man", match: "includes" },
                    { filter: "trait", value: "Merfolk", match: "includes" },
                  ],
                },
              ],
              revealDestination: "hand",
              remainderPosition: "bottom",
            },
          ],
        },
      ],
    });
  });

  test.each([
    [
      "OP06-028",
      "[DON!! x1][When Attacking] If your Leader has the [New Fish-Man Pirates] type, set up to 1 of your DON!! cards as active and this Character gains +1000 power during this turn. Then, add 1 card from the top of your Life cards to your hand.",
      false,
    ],
    [
      "OP06-029",
      "[DON!! x1][When Attacking][Once Per Turn] If your Leader has the [New Fish-Man Pirates] type, set this Character as active and this Character gains +1000 power during this turn. Then, add 1 card from the top of your Life cards to your hand.",
      true,
    ],
  ])("%s keeps the leader gate and mandatory top-Life removal", (_id, text, oncePerTurn) => {
    expect(buildCardEffects(text)).toMatchObject({
      effects: [
        {
          trigger: "whenAttacking",
          conditions: [
            { condition: "donAttached", amount: 1 },
            { condition: "leaderTrait", trait: "New Fish-Man Pirates", match: "includes" },
          ],
          actions: expect.arrayContaining([
            {
              action: "removeFromLife",
              player: "self",
              count: { amount: 1 },
              destination: "hand",
              position: "top",
            },
          ]),
          ...(oncePerTurn && { oncePerTurn: true }),
        },
      ],
    });
  });

  test("OP06-031 keeps the Fish-Man-or-Merfolk Trigger play", () => {
    expect(
      buildCardEffects(
        "[Trigger] Play up to 1 [Fish-Man] or [Merfolk] type Character card with a cost of 3 or less from your hand.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "trigger",
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "hand" },
              count: { amount: 1, upTo: true },
            },
          ],
        },
      ],
    });
  });
});
