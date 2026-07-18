import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

describe("OP05-016 through OP05-032 Character parser regressions", () => {
  test.each([
    ["OP05-016", "your opponent cannot activate [Blocker] during this battle"],
    ["OP05-017", "K.O. up to 1 of your opponent's Characters with 3000 power or less"],
  ])("%s keeps the Trigger cost outside its conditional play-this-card action", (_, attack) => {
    const effects = buildCardEffects(
      `[When Attacking] If this Character has 7000 power or more, ${attack}. [Trigger] You may trash 1 card from your hand: If your Leader is multicolored, play this card.`,
    )?.effects;

    expect(effects?.[0]).toMatchObject({
      trigger: "whenAttacking",
      conditions: [
        {
          condition: "cardState",
          target: "this",
          property: "power",
          comparison: "gte",
          value: 7000,
        },
      ],
    });
    expect(effects?.[1]).toEqual({
      trigger: "trigger",
      costs: [{ cost: "trashFromHand", amount: 1 }],
      actions: [
        {
          action: "playThisCard",
          condition: { condition: "leaderMulticolored" },
        },
      ],
      optional: true,
    });
  });

  test("OP05-029 keeps its DON cost optional and Once Per Turn", () => {
    expect(
      buildCardEffects(
        "[On Your Opponent's Attack][Once Per Turn] (1) (You may rest the specified number of DON!! cards in your cost area.): Rest up to 1 of your opponent's Characters with a cost of 6 or less.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onOpponentAttack",
          costs: [{ cost: "restDon", amount: 1 }],
          actions: [
            {
              action: "rest",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 6 }],
              },
            },
          ],
          optional: true,
          oncePerTurn: true,
        },
      ],
    });
  });

  test("OP05-030 limits its opponent-turn replacement to a rested friendly Character", () => {
    expect(
      buildCardEffects(
        "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Opponent's Turn] If your rested Character would be K.O.'d, you may trash this Character instead.",
      ),
    ).toEqual({
      keywords: ["blocker"],
      replacementEffects: [
        {
          replacedEvent: "ko",
          target: {
            player: "self",
            zones: ["character"],
            count: { amount: 1 },
            filters: [{ filter: "state", value: "rested" }],
          },
          replacementAction: { action: "trashThisCard" },
          conditions: [{ condition: "turn", value: "opponent" }],
        },
      ],
    });
  });

  test("OP05-032 parses the corrected exact-one replacement and self K.O. filter", () => {
    expect(
      buildCardEffects(
        "[End of Your Turn] (1): Set this Character as active. [Once Per Turn] If this Character would be K.O.'d, you may rest 1 of your Characters with a cost of 3 or more other than [Pica] instead.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "endOfYourTurn",
          costs: [{ cost: "restDon", amount: 1 }],
          actions: [
            {
              action: "setActive",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
            },
          ],
          optional: true,
        },
      ],
      replacementEffects: [
        {
          replacedEvent: "ko",
          eventFilter: { targetSelf: true },
          replacementAction: {
            action: "rest",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              filters: [
                { filter: "excludeName", value: "Pica" },
                { filter: "cost", comparison: "gte", value: 3 },
              ],
            },
          },
          oncePerTurn: true,
        },
      ],
    });
  });
});
