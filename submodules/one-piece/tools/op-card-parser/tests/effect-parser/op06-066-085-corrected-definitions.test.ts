import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP06-066 through OP06-085 corrected definition parser regressions", () => {
  test.each([
    ["OP06-066", "Vinsmoke Yonji", 4],
    ["OP06-068", "Vinsmoke Reiju", 4],
  ])("%s keeps both costs and its post-cost GERMA 66 play condition", (_id, name, cost) => {
    expect(
      buildCardEffects(
        `[Activate:Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.)You may trash this Character: If your Leader has the [GERMA 66] type, play up to 1 [${name}] with a cost of ${cost} from your hand or trash.`,
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
                { filter: "cost", comparison: "eq", value: cost },
                { filter: "name", value: name },
              ],
              condition: { condition: "leaderTrait", trait: "GERMA 66", match: "includes" },
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("OP06-067 keeps Blocker and its dynamic DON-comparison permanent power", () => {
    expect(
      buildCardEffects(
        "If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, this Character gains +1000 power.\n[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
      ),
    ).toMatchObject({
      keywords: ["blocker"],
      permanentEffects: [
        {
          conditions: [{ condition: "donFieldComparison", selfComparison: "lte" }],
          actions: [
            {
              action: "modifyPower",
              value: 1000,
              duration: "permanent",
              target: { player: "self", zones: ["character"], self: true },
            },
          ],
        },
      ],
    });
  });

  test("OP06-071 keeps its DON cost and FILM condition after the cost", () => {
    expect(
      buildCardEffects(
        "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader has the [FILM] type, add up to 2 [FILM] type Character cards with a cost of 4 or less from your trash to your hand.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "returnDon", amount: 1 }],
          actions: [
            {
              action: "returnToHand",
              target: {
                player: "self",
                zones: ["trash"],
                count: { amount: 2, upTo: true },
                filters: [
                  { filter: "trait", value: "FILM", match: "includes" },
                  { filter: "cardCategory", value: "character" },
                  { filter: "cost", comparison: "lte", value: 4 },
                ],
              },
              condition: { condition: "leaderTrait", trait: "FILM", match: "includes" },
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("OP06-075 keeps its DON cost, optionality, and two opposing rest targets", () => {
    expect(
      buildCardEffects(
        "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Rest up to 2 of your opponent's Characters with a cost of 2 or less.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "returnDon", amount: 1 }],
          actions: [
            {
              action: "rest",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 2, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 2 }],
              },
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("OP06-081 keeps ordered trash return as an optional cost and owner-neutral K.O.", () => {
    expect(
      buildCardEffects(
        "[On Play] You may return 2 cards from your trash to the bottom of your deck in any order: K.O. up to 1 Character with a cost of 2 or less.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "returnTrashToDeck", amount: 2, position: "bottom" }],
          actions: [
            {
              action: "ko",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 2 }],
              },
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("OP06-082 duplicates its inclusive Leader condition and draw-then-trash actions for both triggers", () => {
    expect(
      buildCardEffects(
        "[On Play] / [On K.O.] If your Leader has the [Thriller Bark Pirates] type, draw 2 cards and trash 2 cards from your hand.",
      ),
    ).toMatchObject({
      effects: ["onPlay", "onKo"].map((trigger) => ({
        trigger,
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Thriller Bark Pirates",
            match: "includes",
          },
        ],
        actions: [
          { action: "draw", player: "self", amount: 2 },
          { action: "trashFromHand", player: "self", amount: 2 },
        ],
      })),
    });
  });

  test("OP06-085 keeps both permanent conditions and trash-group power scaling", () => {
    expect(
      buildCardEffects(
        "[DON!! x2][Your Turn] This Character gains +1000 power for every 5 cards in your trash.",
      ),
    ).toMatchObject({
      permanentEffects: [
        {
          conditions: [
            { condition: "donAttached", amount: 2 },
            { condition: "turn", value: "your" },
          ],
          actions: [
            {
              action: "modifyPower",
              value: 1000,
              duration: "permanent",
              valuePerCardGroup: {
                size: 5,
                target: { player: "self", zones: ["trash"], count: { amount: "all" } },
              },
            },
          ],
        },
      ],
    });
  });
});
