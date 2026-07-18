import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP06-052 through OP06-090 parser regressions", () => {
  test("preserves Judge's different-name, Character, and power play constraints", () => {
    const generated = buildCardEffects(
      '[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.) You may trash 2 cards from your hand: Play up to 4 "GERMA 66" type Character cards with different card names and 4000 power or less from your trash.',
    );

    expect(generated?.effects?.[0]?.actions?.[0]).toMatchObject({
      action: "play",
      differentNames: true,
      filters: expect.arrayContaining([
        { filter: "trait", value: "GERMA 66", match: "includes" },
        { filter: "cardCategory", value: "character" },
        { filter: "power", comparison: "lte", value: 4000 },
      ]),
    });
  });

  test("maps Oars' qualified Character K.O. activation cost", () => {
    const generated = buildCardEffects(
      "This Character cannot attack.\n[Activate:Main] You may K.O. 1 of your [Thriller Bark Pirates] type Characters: This Character's effect is negated during this turn.",
    );

    expect(generated?.effects?.[0]).toMatchObject({
      trigger: "activateMain",
      costs: [
        {
          cost: "koCharacter",
          amount: 1,
          filters: [{ filter: "trait", value: "Thriller Bark Pirates", match: "includes" }],
        },
      ],
    });
  });

  test("maps Cosette's two-DON field deficit", () => {
    const generated = buildCardEffects(
      "If your Leader has the {GERMA 66} type and the number of DON!! cards on your field is at least 2 less than the number on your opponent's field, this Character gains [Blocker].",
    );

    expect(generated?.permanentEffects?.[0]?.conditions).toEqual([
      {
        condition: "compound",
        operator: "and",
        conditions: [
          { condition: "leaderTrait", trait: "GERMA 66", match: "includes" },
          { condition: "donFieldComparison", selfComparison: "lte", difference: 2 },
        ],
      },
    ]);
  });

  test("maps a cost-1 Stage returned to its owner's deck as an activation cost", () => {
    const generated = buildCardEffects(
      "[Activate:Main][Once Per Turn] You may place 1 Stage with a cost of 1 at the bottom of the owner's deck: K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
    );

    expect(generated?.effects?.[0]).toMatchObject({
      trigger: "activateMain",
      oncePerTurn: true,
      costs: [
        {
          cost: "returnCharacterToDeck",
          amount: 1,
          position: "bottom",
          player: "both",
          zones: ["stage"],
          filters: [{ filter: "cost", comparison: "eq", value: 1 }],
        },
      ],
    });
  });

  test("keeps Zephyr's conditional K.O. on the previously negated target", () => {
    const generated = buildCardEffects(
      "[On Play] DON!! -1: Negate the effect of up to 1 of your opponent's Characters during this turn. Then, if that Character has 5000 power or less, K.O. it.",
    );

    expect(generated?.effects?.[0]?.actions?.[1]).toMatchObject({
      action: "ko",
      previousActionTargets: true,
      target: { filters: [{ filter: "power", comparison: "lte", value: 5000 }] },
    });
  });

  test("maps Sai's Leader trait and active-state permanent conditions", () => {
    const generated = buildCardEffects(
      "If your Leader has the {Dressrosa} type and is active, this Character gains +2000 power.",
    );

    expect(generated?.permanentEffects?.[0]?.conditions).toEqual([
      {
        condition: "compound",
        operator: "and",
        conditions: [
          { condition: "leaderTrait", trait: "Dressrosa", match: "includes" },
          {
            condition: "hasCard",
            player: "self",
            zone: "leader",
            filters: [{ filter: "state", value: "active" }],
          },
        ],
      },
    ]);
  });

  test("maps Hogback's ordered trash payment and trait-only recovery", () => {
    const generated = buildCardEffects(
      "[On Play] You may return 2 cards from your trash to the bottom of your deck in any order: Add up to 1 {Thriller Bark Pirates} type card other than [Dr. Hogback] from your trash to your hand.",
    );

    expect(generated?.effects?.[0]).toMatchObject({
      costs: [{ cost: "returnTrashToDeck", amount: 2, position: "bottom" }],
      actions: [
        {
          action: "returnToHand",
          target: {
            filters: [
              { filter: "trait", value: "Thriller Bark Pirates", match: "includes" },
              { filter: "excludeName", value: "Dr. Hogback" },
            ],
          },
        },
      ],
    });
  });

  test("keeps both Brook choice branches and opponent-owned ordering", () => {
    const generated = buildCardEffects(
      "[On Play] Choose one:\n• Trash up to 1 of your opponent's Characters with a cost of 4 or less.\n• Your opponent places 3 cards from their trash at bottom of their deck in any order.",
    );
    const choice = generated?.effects?.[0]?.actions?.[0];

    expect(choice).toMatchObject({ action: "choice" });
    if (choice?.action !== "choice") throw new Error("Expected Brook's choice action.");
    expect(choice.options).toHaveLength(2);
    expect(choice.options[1]?.[0]).toMatchObject({
      action: "returnToDeck",
      target: { player: "opponent", chosenBy: "opponent", zones: ["trash"] },
      position: "bottom",
      order: "any",
    });
  });

  test("maps Momonosuke's trait-filtered face-up Life movement", () => {
    const generated = buildCardEffects(
      '[On Play] Add up to 1 of your "Land of Wano" type Characters other than [Kouzuki Momonosuke] to the top or bottom of the owner\'s Life cards face-up.',
    );

    expect(generated?.effects?.[0]?.actions?.[0]).toMatchObject({
      action: "addToLife",
      position: "choice",
      faceUp: true,
      target: {
        filters: [
          { filter: "trait", value: "Land of Wano", match: "includes" },
          { filter: "excludeName", value: "Kouzuki Momonosuke" },
        ],
      },
    });
  });

  test("distinguishes Wyper's named Stage from its trait search alternative", () => {
    const generated = buildCardEffects(
      "[On Play] You may place 1 Stage with a cost of 1 at the bottom of the owner's deck: Look at 5 cards from the top of your deck; reveal up to 1 [Upper Yard] or [Shandian Warrior] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
    );

    expect(generated?.effects?.[0]?.actions?.[0]).toMatchObject({
      action: "search",
      revealFilters: [
        {
          filter: "anyOf",
          filters: [
            { filter: "name", value: "Upper Yard" },
            { filter: "trait", value: "Shandian Warrior", match: "includes" },
          ],
        },
      ],
    });
  });
});
