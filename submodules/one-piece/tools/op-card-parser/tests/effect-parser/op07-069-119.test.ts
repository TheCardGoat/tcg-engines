import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP07-069 through OP07-119 parser regressions", () => {
  test("preserves a Trigger power modifier through the end of your next turn", () => {
    const generated = buildCardEffects(
      "[Trigger] Up to 1 of your {Egghead} type Leader or Character cards gains +2000 power until the end of your next turn.",
    );

    expect(generated?.effects?.[0]).toMatchObject({
      trigger: "trigger",
      actions: [
        {
          action: "modifyPower",
          value: 2000,
          duration: "untilEndOfYourNextTurn",
          target: {
            player: "self",
            zones: ["leader", "character"],
            filters: [{ filter: "trait", value: "Egghead", match: "includes" }],
          },
        },
      ],
    });
  });

  test("keeps a Leader-trait condition on a Trigger draw", () => {
    expect(
      buildCardEffects("[Trigger] If your Leader has the {Egghead} type, draw 2 cards."),
    ).toMatchObject({
      effects: [
        {
          trigger: "trigger",
          conditions: [{ condition: "leaderTrait", trait: "Egghead", match: "includes" }],
          actions: [{ action: "draw", player: "self", amount: 2 }],
        },
      ],
    });
  });

  test("keeps the controller-chosen opponent-trash follow-up on OP07-093", () => {
    const generated = buildCardEffects(
      "[On Play] You may place 3 cards from your trash at the bottom of your deck in any order: Your opponent trashes 1 card from their hand. Then, you may place up to 1 card from your opponent's trash at the bottom of their deck.",
    );

    expect(generated?.effects?.[0]).toMatchObject({
      trigger: "onPlay",
      costs: [{ cost: "returnTrashToDeck", amount: 3, position: "bottom" }],
      actions: [
        { action: "trashFromHand", player: "opponent", amount: 1 },
        {
          action: "returnToDeck",
          target: {
            player: "opponent",
            zones: ["trash"],
            count: { amount: 1, upTo: true },
            chosenBy: "self",
          },
          position: "bottom",
        },
      ],
      optional: true,
    });
  });

  test("parses Stussy's plain own-Character trash cost", () => {
    expect(
      buildCardEffects(
        "[On Play] You may trash 1 of your Characters: K.O. up to 1 of your opponent's Characters.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "trashCharacter", amount: 1 }],
          actions: [{ action: "ko" }],
          optional: true,
        },
      ],
    });
  });

  test("keeps Morgans's opponent discard, full-hand reveal, and draw in order", () => {
    expect(
      buildCardEffects(
        "[On Play] Your opponent trashes 1 card from their hand and reveals their hand. Then, your opponent draws 1 card.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            { action: "trashFromHand", player: "opponent", amount: 1 },
            { action: "revealFromHand", player: "opponent", amount: "all" },
            { action: "draw", player: "opponent", amount: 1 },
          ],
        },
      ],
    });
  });

  test("keeps Luffy's variable trash return and one power step per complete three", () => {
    const generated = buildCardEffects(
      "[When Attacking] Trash up to 1 of your opponent's Characters with a cost of 2 or less. Then, place any number of Character cards with a cost of 4 or more from your trash at the bottom of your deck in any order. This Character gains +1000 power during this turn for every 3 cards placed at the bottom of your deck.",
    );

    expect(generated?.effects?.[0]?.actions).toMatchObject([
      { action: "trashFromField" },
      {
        action: "returnToDeck",
        target: {
          player: "self",
          zones: ["trash"],
          count: { amount: "all", upTo: true },
          filters: expect.arrayContaining([
            { filter: "cardCategory", value: "character" },
            { filter: "cost", comparison: "gte", value: 4 },
          ]),
        },
        position: "bottom",
        order: "any",
      },
      {
        action: "modifyPower",
        value: 0,
        valuePerPreviousActionTarget: 1000,
        previousActionTargetGroupSize: 3,
        duration: "thisTurn",
      },
    ]);
  });
});
