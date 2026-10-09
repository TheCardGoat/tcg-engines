import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

test("Hawkins checks the hand condition once for both draw and the Then power gain", () => {
  const effects = buildCardEffects(
    "[Blocker] [On Block] Draw 1 card if you have 3 or less cards in your hand. Then, this Character gains +1000 power during this battle.",
  );
  expect(effects?.effects?.[0]?.actions).toEqual([
    {
      action: "conditional",
      predicate: { condition: "handCount", player: "self", comparison: "lte", value: 3 },
      whenTrue: [
        { action: "draw", player: "self", amount: 1 },
        {
          action: "modifyPower",
          target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
          value: 1000,
          duration: "thisBattle",
        },
      ],
    },
  ]);
});

test("Amazon offers the Life choice only when the opponent can trash the full amount", () => {
  const effects = buildCardEffects(
    "[On Your Opponent's Attack] You may rest this Character: Your opponent may trash 1 card from the top of their Life cards. If they do not, give up to 1 of your opponent's Leader or Character cards -2000 power during this turn.",
  );
  const power = {
    action: "modifyPower",
    target: {
      player: "opponent",
      zones: ["leader", "character"],
      count: { amount: 1, upTo: true },
    },
    value: -2000,
    duration: "thisTurn",
  };
  expect(effects?.effects?.[0]?.actions).toEqual([
    {
      action: "conditional",
      predicate: { condition: "lifeCount", player: "opponent", comparison: "gte", value: 1 },
      whenTrue: [
        {
          action: "choice",
          player: "opponent",
          options: [
            [
              {
                action: "removeFromLife",
                player: "opponent",
                count: { amount: 1 },
                destination: "trash",
              },
            ],
            [power],
          ],
        },
      ],
      whenFalse: [power],
    },
  ]);
});
