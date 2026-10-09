import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

test("Ace's optional once-per-turn KO replacement trashes mandatory top-or-bottom Life", () => {
  const result = buildCardEffects(
    "[Once Per Turn] If this Character would be K.O.'d, you may trash 1 card from the top or bottom of your Life cards instead.",
  );
  expect(result?.replacementEffects).toEqual([
    {
      replacedEvent: "ko",
      eventFilter: { targetSelf: true },
      oncePerTurn: true,
      replacementAction: {
        action: "removeFromLife",
        player: "self",
        count: { amount: 1 },
        destination: "trash",
        position: "choice",
      },
    },
  ]);
});

test("Bon Kurei binds the exact battled Character and only follows a successful KO", () => {
  expect(
    buildCardEffects(
      "[DON!! x1] At the end of a battle in which this Character battles your opponent's Character, you may K.O. the opponent’s Character you battled with. If you do, K.O. this Character.",
    )?.effects,
  ).toEqual([
    {
      trigger: "endOfBattle",
      conditions: [{ condition: "donAttached", amount: 1 }],
      optional: true,
      eventFilter: {
        battlePowerCompared: true,
        anyOf: [
          { sourceSelf: true, targetFilters: [{ filter: "cardCategory", value: "character" }] },
          { targetSelf: true, sourceFilters: [{ filter: "cardCategory", value: "character" }] },
        ],
      },
      actions: [
        {
          action: "ko",
          battleOpponent: true,
          target: { player: "opponent", zones: ["character"], count: { amount: 1 } },
          thenActions: [
            {
              action: "ko",
              target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
            },
          ],
        },
      ],
    },
  ]);
});
