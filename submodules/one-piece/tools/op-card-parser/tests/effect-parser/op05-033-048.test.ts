import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP05-033 through OP05-048 parser regressions", () => {
  test("builds Baby 5's ordered DON!! and self-rest costs before inclusive hand play", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] (1) (You may rest the specified number of DON!! cards in your cost area.) You may rest this Character: Play up to 1 [Donquixote Pirates] type Character card with a cost of 2 or less from your hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "restDon", amount: 1 }, { cost: "restThisCard" }],
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "hand" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "lte", value: 2 },
                { filter: "trait", value: "Donquixote Pirates", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("builds Baby 5's paid inclusive top-five Donquixote search", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] (1) (You may rest the specified number of DON!! cards in your cost area.) You may rest this Character: Look at 5 cards from the top of your deck; reveal up to 1 [Donquixote Pirates] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "restDon", amount: 1 }, { cost: "restThisCard" }],
          actions: [
            {
              action: "search",
              lookCount: 5,
              source: { player: "self", zone: "deck" },
              revealCount: { amount: 1, upTo: true },
              revealFilters: [{ filter: "trait", value: "Donquixote Pirates", match: "includes" }],
              revealDestination: "hand",
              remainderPosition: "bottom",
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("preserves Ulti's multicolor condition and top-or-bottom remainder choice", () => {
    expect(
      buildCardEffects(
        "[On Play] If your Leader is multicolored, look at 3 cards from the top of your deck and add up to 1 card to your hand. Then, place the rest at the top or bottom of the deck in any order.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [{ condition: "leaderMulticolored" }],
          actions: [
            {
              action: "search",
              lookCount: 3,
              source: { player: "self", zone: "deck" },
              revealCount: { amount: 1, upTo: true },
              revealDestination: "hand",
              remainderPosition: "any",
            },
          ],
        },
      ],
    });
  });

  test("preserves Stainless's two ordered costs and owner-neutral deck return", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] You may trash 1 card from your hand and rest this Character: Place up to 1 Character with a cost of 2 or less at the bottom of the owner's deck.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "trashFromHand", amount: 1 }, { cost: "restThisCard" }],
          actions: [
            {
              action: "returnToDeck",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 2 }],
              },
              position: "bottom",
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("preserves Bastille's DON!!-gated owner-neutral attack return", () => {
    expect(
      buildCardEffects(
        "[DON!! x1][When Attacking] Place up to 1 Character with a cost of 2 or less at the bottom of the owner's deck.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenAttacking",
          conditions: [{ condition: "donAttached", amount: 1 }],
          actions: [
            {
              action: "returnToDeck",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 2 }],
              },
              position: "bottom",
            },
          ],
        },
      ],
    });
  });
});
