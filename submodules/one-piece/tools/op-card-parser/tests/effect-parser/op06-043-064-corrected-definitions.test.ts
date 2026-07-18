import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP06-043 through OP06-064 corrected definition parser regressions", () => {
  test("OP06-043 preserves both costs, owner-neutral placement, optionality, and once-per-turn power", () => {
    expect(
      buildCardEffects(
        "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[Activate:Main] [Once Per Turn] You may trash 1 card from your hand and place 1 Character with a cost of 2 or less at the bottom of the owner's deck: This Character gains +3000 power during this turn.",
      ),
    ).toMatchObject({
      keywords: ["blocker"],
      effects: [
        {
          trigger: "activateMain",
          costs: [
            { cost: "trashFromHand", amount: 1 },
            {
              cost: "returnCharacterToDeck",
              amount: 1,
              position: "bottom",
              player: "both",
              filters: [{ filter: "cost", comparison: "lte", value: 2 }],
            },
          ],
          actions: [{ action: "modifyPower", value: 3000, duration: "thisTurn" }],
          optional: true,
          oncePerTurn: true,
        },
      ],
    });
  });

  test("OP06-044 keeps the your-turn event condition and opponent-owned hand choice", () => {
    expect(
      buildCardEffects(
        "[Your Turn][Once Per Turn] When your opponent activates an Event, your opponent must place 1 card from their hand at the bottom of their deck.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "whenOpponentActivatesEvent",
          conditions: [{ condition: "turn", value: "your" }],
          actions: [
            {
              action: "returnToDeck",
              target: {
                player: "opponent",
                zones: ["hand"],
                count: { amount: 1 },
                chosenBy: "opponent",
              },
              position: "bottom",
            },
          ],
          oncePerTurn: true,
        },
      ],
    });
  });

  test("OP06-046 keeps the owner-neutral optional Character return", () => {
    expect(
      buildCardEffects(
        "[On Play] Place up to 1 Character with a cost of 2 or less at the bottom of the owner's deck.",
      ),
    ).toMatchObject({
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
                filters: [{ filter: "cost", comparison: "lte", value: 2 }],
              },
              position: "bottom",
            },
          ],
        },
      ],
    });
  });

  test("OP06-050 keeps inclusive Navy matching while excluding Tashigi", () => {
    expect(
      buildCardEffects(
        '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 "Navy" type card other than [Tashigi] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
      ),
    ).toMatchObject({
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
                { filter: "excludeName", value: "Tashigi" },
                { filter: "trait", value: "Navy", match: "includes" },
              ],
              revealDestination: "hand",
              remainderPosition: "bottom",
            },
          ],
        },
      ],
    });
  });

  test("OP06-053 keeps its On K.O. owner-neutral return", () => {
    expect(
      buildCardEffects(
        "[On K.O.] Place up to 1 Character with a cost of 2 or less at the bottom of the owner's deck.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onKo",
          actions: [
            {
              action: "returnToDeck",
              target: {
                player: "any",
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

  test("OP06-054 keeps the dynamic hand-count Blocker permanent", () => {
    expect(
      buildCardEffects(
        "If you have 4 or less cards in your hand, this Character gains [Blocker].\n(After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
      ),
    ).toMatchObject({
      permanentEffects: [
        {
          conditions: [{ condition: "handCount", player: "self", comparison: "lte", value: 4 }],
          actions: [
            {
              action: "grantKeyword",
              keyword: "blocker",
              duration: "permanent",
              target: { player: "self", zones: ["character"], self: true },
            },
          ],
        },
      ],
    });
  });

  test("OP06-060 keeps both costs and the post-cost inclusive GERMA 66 condition", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.)You may trash this Character: If your Leader has the [GERMA 66] type, play up to 1 [Vinsmoke Ichiji] with a cost of 7 from your hand or trash.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "returnDon", amount: 1 }, { cost: "trashThisCard" }],
          actions: [
            {
              action: "play",
              source: { player: "self", zone: ["hand", "trash"] },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "eq", value: 7 },
                { filter: "name", value: "Vinsmoke Ichiji" },
              ],
              condition: { condition: "leaderTrait", trait: "GERMA 66", match: "includes" },
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("OP06-063 keeps its discard cost, DON comparison, and inclusive family filter", () => {
    expect(
      buildCardEffects(
        "[On Play] You may trash 1 card from your hand: If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, add up to 1 [The Vinsmoke Family] type Character card with 4000 power or less from your trash to your hand.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "trashFromHand", amount: 1 }],
          actions: [
            {
              action: "returnToHand",
              target: {
                player: "self",
                zones: ["trash"],
                count: { amount: 1, upTo: true },
                filters: [
                  { filter: "trait", value: "The Vinsmoke Family", match: "includes" },
                  { filter: "cardCategory", value: "character" },
                  { filter: "power", comparison: "lte", value: 4000 },
                ],
              },
              condition: { condition: "donFieldComparison", selfComparison: "lte" },
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("OP06-064 keeps both costs and the post-cost inclusive GERMA 66 condition", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.)You may trash this Character: If your Leader has the [GERMA 66] type, play up to 1 [Vinsmoke Niji] with a cost of 5 from your hand or trash.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "returnDon", amount: 1 }, { cost: "trashThisCard" }],
          actions: [
            {
              action: "play",
              source: { player: "self", zone: ["hand", "trash"] },
              filters: [
                { filter: "cost", comparison: "eq", value: 5 },
                { filter: "name", value: "Vinsmoke Niji" },
              ],
              condition: { condition: "leaderTrait", trait: "GERMA 66", match: "includes" },
            },
          ],
          optional: true,
        },
      ],
    });
  });
});
