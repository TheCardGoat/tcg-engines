import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP03-054/055/057 blue Event parser regressions", () => {
  test("preserves both optional top-deck trash clauses on Usopp's Rubber Band of Doom", () => {
    const result = buildCardEffects(
      "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, you may trash 1 card from the top of your deck. [Trigger] Draw 1 card and you may trash 1 card from the top of your deck. This card has been officially errata'd.",
    );

    expect(result?.effects?.[0]).toMatchObject({
      trigger: "counter",
      actions: [
        { action: "modifyPower", value: 2000, duration: "thisBattle" },
        {
          action: "optional",
          actions: [{ action: "trashFromDeck", player: "self", amount: 1 }],
        },
      ],
    });
    expect(result?.effects?.[1]).toMatchObject({
      trigger: "trigger",
      actions: [
        { action: "draw", player: "self", amount: 1 },
        {
          action: "optional",
          actions: [{ action: "trashFromDeck", player: "self", amount: 1 }],
        },
      ],
    });
  });

  test("preserves Giant Gavel's optional deck trash and either-field Trigger target", () => {
    const result = buildCardEffects(
      "[Counter] You may trash 1 card from your hand: Up to 1 of your Leader gains +4000 power during this battle. Then, you may trash 2 cards from the top of your deck. [Trigger] Return up to 1 Character with a cost of 4 or less to the owner's hand.",
    );

    expect(result?.effects?.[0]).toMatchObject({
      trigger: "counter",
      costs: [{ cost: "trashFromHand", amount: 1 }],
      actions: [
        { action: "modifyPower", value: 4000, duration: "thisBattle" },
        {
          action: "optional",
          actions: [{ action: "trashFromDeck", player: "self", amount: 2 }],
        },
      ],
      optional: true,
    });
    expect(result?.effects?.[1]).toMatchObject({
      trigger: "trigger",
      actions: [{ action: "returnToHand", target: { player: "any" } }],
    });
  });

  test("maps both Three Thousand Worlds timings to either field", () => {
    const result = buildCardEffects(
      "[Main] Place up to 1 Character with a cost of 5 or less at the bottom of the owner's deck. [Trigger] Place up to 1 Character with a cost of 3 or less at the bottom of the owner's deck.",
    );

    expect(result?.effects).toMatchObject([
      {
        trigger: "main",
        actions: [
          {
            action: "returnToDeck",
            target: { player: "any", filters: [{ value: 5 }] },
            position: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "returnToDeck",
            target: { player: "any", filters: [{ value: 3 }] },
            position: "bottom",
          },
        ],
      },
    ]);
  });
});
