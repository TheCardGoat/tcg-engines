import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP06-099 through OP06-104 corrected definition parser regressions", () => {
  test("OP06-099 keeps either Life owner, optional look, and top-or-bottom replacement", () => {
    expect(
      buildCardEffects(
        "[On Play] Look at up to 1 card from the top of your or your opponent's Life cards and place it at the top or bottom of the Life cards.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            { action: "lookAtLife", player: "either", position: "topOrBottom", upTo: true },
          ],
        },
      ],
    });
  });

  test("OP06-100 keeps attack cost/dynamic K.O. and its conditional Trigger play block", () => {
    expect(
      buildCardEffects(
        "[DON!! x2][When Attacking] You may trash 1 card from your hand: K.O. up to 1 of your opponent's Characters with a cost equal to or less than the number of your opponent's Life cards.\n[Trigger] If your opponent has 3 or less Life cards, play this card.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "whenAttacking",
          conditions: [{ condition: "donAttached", amount: 2 }],
          costs: [{ cost: "trashFromHand", amount: 1 }],
          actions: [
            {
              action: "ko",
              target: {
                player: "opponent",
                count: { amount: 1, upTo: true },
                filters: [
                  { filter: "dynamicCost", comparison: "lte", source: "opponentLifeCount" },
                ],
              },
            },
          ],
          optional: true,
        },
        {
          trigger: "trigger",
          conditions: [{ condition: "lifeCount", player: "opponent", comparison: "lte", value: 3 }],
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });

  test("OP06-101 keeps its temporary Banish grant and separate Trigger K.O. block", () => {
    expect(
      buildCardEffects(
        "[On Play] Up to 1 of your Leader or Character cards gains [Banish] during this turn.\n(When this card deals damage, the target card is trashed without activating its Trigger.)\n[Trigger] K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              keyword: "banish",
              duration: "thisTurn",
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "ko",
              target: {
                player: "opponent",
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 5 }],
              },
            },
          ],
        },
      ],
    });
  });

  test("OP06-103 keeps two-card cost and face-up owner-Life position choice", () => {
    expect(
      buildCardEffects(
        "[When Attacking] You may trash 2 cards from your hand: Add up to 1 of your Characters with 0 power to the top or bottom of the owner's Life cards face-up.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "whenAttacking",
          costs: [{ cost: "trashFromHand", amount: 2 }],
          actions: [
            {
              action: "addToLife",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "power", comparison: "eq", value: 0 }],
              },
              position: "choice",
              faceUp: true,
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("OP06-104 keeps conditional On K.O. top-Life addition and conditional Trigger play", () => {
    expect(
      buildCardEffects(
        "[On K.O.] If your opponent has 3 or less Life cards, add up to 1 card from the top of your deck to the top of your Life cards.\n[Trigger] If your opponent has 3 or less Life cards, play this card.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onKo",
          conditions: [{ condition: "lifeCount", player: "opponent", comparison: "lte", value: 3 }],
          actions: [
            {
              action: "addToLife",
              target: {
                player: "self",
                zones: ["deck"],
                count: { amount: 1, upTo: true },
              },
              position: "top",
            },
          ],
        },
        {
          trigger: "trigger",
          conditions: [{ condition: "lifeCount", player: "opponent", comparison: "lte", value: 3 }],
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });
});
