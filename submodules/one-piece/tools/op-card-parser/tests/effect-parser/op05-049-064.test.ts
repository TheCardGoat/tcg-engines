import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP05-049 through OP05-064 parser regressions", () => {
  test("builds Haccha's DON!!-gated owner-neutral hand return", () => {
    expect(
      buildCardEffects(
        "[DON!! x1][When Attacking] Return up to 1 Character with a cost of 3 or less to the owner's hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenAttacking",
          conditions: [{ condition: "donAttached", amount: 1 }],
          actions: [
            {
              action: "returnToHand",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 3 }],
              },
            },
          ],
        },
      ],
    });
  });

  test("builds Borsalino's owner-neutral bottom-deck return", () => {
    expect(
      buildCardEffects(
        "[On Play] Place up to 1 Character with a cost of 4 or less at the bottom of the owner's deck.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "returnToDeck",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 4 }],
              },
              position: "bottom",
            },
          ],
        },
      ],
    });
  });

  test("maps Mozambia's outside-Draw-Phase draw to its dedicated trigger", () => {
    expect(
      buildCardEffects(
        "[Your Turn][Once Per Turn] When you draw a card outside of your Draw Phase, this Character gains +2000 power during this turn.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenCardDrawn",
          conditions: [{ condition: "turn", value: "your" }],
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              value: 2000,
              duration: "thisTurn",
            },
          ],
          oncePerTurn: true,
        },
      ],
    });
  });

  test("builds O-Nami's exact-10-DON!! dynamic Blocker", () => {
    expect(
      buildCardEffects(
        "If you have 10 DON!! cards on your field, this Character gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
      ),
    ).toEqual({
      permanentEffects: [
        {
          conditions: [
            {
              condition: "donFieldCount",
              player: "self",
              comparison: "eq",
              value: 10,
            },
          ],
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              keyword: "blocker",
              duration: "permanent",
            },
          ],
        },
      ],
    });
  });

  test("builds Killer's inclusive trait search with same-name exclusion", () => {
    expect(
      buildCardEffects(
        "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Kid Pirates] type card other than [Killer] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "search",
              lookCount: 5,
              source: { player: "self", zone: "deck" },
              revealCount: { amount: 1, upTo: true },
              revealFilters: [
                { filter: "excludeName", value: "Killer" },
                { filter: "trait", value: "Kid Pirates", match: "includes" },
              ],
              revealDestination: "hand",
              remainderPosition: "bottom",
            },
          ],
        },
      ],
    });
  });
});
