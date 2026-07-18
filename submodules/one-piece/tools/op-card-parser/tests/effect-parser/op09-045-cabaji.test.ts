import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP09-045 Cabaji", () => {
  test("keeps either-name field condition on permanent battle K.O. protection", () => {
    expect(
      buildCardEffects(
        "If you have a [Buggy] or [Mohji] Character, this Character cannot be K.O.'d in battle.",
      ),
    ).toEqual({
      permanentEffects: [
        {
          conditions: [
            {
              condition: "compound",
              operator: "or",
              conditions: [
                {
                  condition: "hasCard",
                  player: "self",
                  zone: "character",
                  filters: [{ filter: "name", value: "Buggy" }],
                },
                {
                  condition: "hasCard",
                  player: "self",
                  zone: "character",
                  filters: [{ filter: "name", value: "Mohji" }],
                },
              ],
            },
          ],
          actions: [
            {
              action: "cannotBeKod",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              duration: "permanent",
              restriction: "inBattle",
            },
          ],
        },
      ],
    });
  });
});

describe("OP09 shared parser regressions", () => {
  test("keeps hand-gap draw and trash actions", () => {
    expect(
      buildCardEffects(
        "[Activate: Main] You may rest this Character: If the number of cards in your hand is at least 3 less than the number in your opponent's hand, draw 2 cards and trash 1 card from your hand.",
      )?.effects?.[0],
    ).toMatchObject({
      actions: [
        {
          action: "conditional",
          predicate: { condition: "compareHands", selfComparison: "lte", difference: 3 },
          whenTrue: [
            { action: "draw", amount: 2 },
            { action: "trashFromHand", amount: 1 },
          ],
        },
      ],
    });
  });

  test("keeps both negation targets and reuses the Character for attack prevention", () => {
    expect(
      buildCardEffects(
        "[Blocker]\n[Activate: Main] [Once Per Turn] If your Leader has the \"Blackbeard Pirates\" type and this Character was played on this turn, negate the effect of up to 1 of your opponent's Leader during this turn. Then, negate the effect of up to 1 of your opponent's Characters and that Character cannot attack until the end of your opponent's next turn.",
      )?.effects?.[0]?.actions,
    ).toMatchObject([
      { action: "negateEffects", target: { zones: ["leader"] } },
      { action: "negateEffects", target: { zones: ["character"] } },
      {
        action: "cannotAttack",
        previousActionTargets: true,
        duration: "untilEndOfOpponentNextTurn",
      },
    ]);
  });

  test("keeps the compound Life Trigger play", () => {
    expect(
      buildCardEffects(
        '[Trigger] If your Leader has the "Revolutionary Army" type and you and your opponent have a total of 5 or less Life cards, play this card.',
      )?.effects?.[0],
    ).toMatchObject({
      trigger: "trigger",
      conditions: [{ condition: "compound", operator: "and" }],
      actions: [{ action: "playThisCard" }],
    });
  });

  test("keeps top-or-bottom Life placement as a choice", () => {
    expect(
      buildCardEffects(
        "[On Play] Place 1 of your opponent's Characters with a cost of 3 or less at the top or bottom of your opponent's Life cards face-up: Your opponent trashes 1 card from their hand.",
      )?.effects?.[0]?.actions?.[0],
    ).toMatchObject({ action: "addToLife", position: "choice", faceUp: true });
  });

  test("draws only after the optional hand play succeeds", () => {
    expect(
      buildCardEffects(
        '[Blocker]\n[On Play] You may add 1 card from the top or bottom of your Life cards to your hand: Play up to 1 "Revolutionary Army" type Character card with a cost of 4 or less from your hand. If you do, draw 1 card.',
      )?.effects?.[0],
    ).toMatchObject({
      costs: [{ cost: "addLifeToHand", position: "choice" }],
      actions: [{ action: "play", thenActions: [{ action: "draw", amount: 1 }] }],
    });
  });
});
