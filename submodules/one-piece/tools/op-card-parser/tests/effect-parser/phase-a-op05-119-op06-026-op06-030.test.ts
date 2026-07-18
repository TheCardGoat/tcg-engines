import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("Phase A parser regressions", () => {
  test("OP05-119 excludes only the source, keeps DON!! optionality, and schedules an extra turn", () => {
    expect(
      buildCardEffects(
        "[On Play] DON!! -10: Place all of your Characters except this Character at the bottom of your deck in any order. Then, take an extra turn after this one. [Activate:Main][Once Per Turn] (1): Add up to 1 DON!! card from your DON!! deck and set it as active.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "returnDon", amount: 10 }],
          actions: [
            {
              action: "returnToDeck",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: "all" },
                filters: [{ filter: "excludeSelf" }],
              },
              position: "bottom",
              order: "any",
            },
            { action: "extraTurn" },
          ],
          optional: true,
        },
        {
          trigger: "activateMain",
          costs: [{ cost: "restDon", amount: 1 }],
          actions: [{ action: "addDon", count: { amount: 1, upTo: true }, state: "active" }],
          oncePerTurn: true,
        },
      ],
    });
  });

  test("OP06-026 readies the Slash boundary then prevents every own card from attacking a Leader", () => {
    expect(
      buildCardEffects(
        '[On Play] Set up to 1 of your "Slash" attribute Characters with a cost of 4 or less as active. Then, you cannot attack a Leader during this turn.',
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "setActive",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [
                  { filter: "attribute", value: "slash" },
                  { filter: "cost", comparison: "lte", value: 4 },
                ],
              },
            },
            {
              action: "cannotAttackTargets",
              attacker: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: "all" },
              },
              filters: [{ filter: "cardCategory", value: "leader" }],
              duration: "thisTurn",
            },
          ],
        },
      ],
    });
  });

  test("OP06-030 keeps both timed buffs and the mandatory Life follow-up", () => {
    expect(
      buildCardEffects(
        "[When Attacking] If your Leader has the [New Fish-Man Pirates] type, this Character cannot be K.O.'d in battle and gains +2000 power until the start of your next turn. Then, add 1 card from the top of your Life cards to your hand.",
      ),
    ).toMatchObject({
      effects: [
        {
          actions: [
            { action: "cannotBeKod", duration: "untilStartOfNextTurn", restriction: "inBattle" },
            { action: "modifyPower", value: 2000, duration: "untilStartOfNextTurn" },
            {
              action: "removeFromLife",
              player: "self",
              count: { amount: 1 },
              destination: "hand",
              position: "top",
            },
          ],
        },
      ],
    });
  });
});
