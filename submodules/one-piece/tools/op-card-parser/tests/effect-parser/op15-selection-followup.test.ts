import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

test("Purinpurin chooses a rested Character before checking cost versus its given DON", () => {
  expect(
    buildCardEffects(
      "[On Play] Select up to 1 of your opponent's rested Characters. If the chosen Character has a cost equal to the number of DON!! cards given to it, K.O. it.",
    )?.effects?.[0]?.actions,
  ).toEqual([
    {
      action: "ko",
      target: {
        player: "opponent",
        zones: ["character"],
        count: { amount: 1, upTo: true },
        filters: [{ filter: "state", value: "rested" }],
      },
      selectedTargetFilters: [
        { filter: "dynamicCost", comparison: "eq", source: "candidateAttachedDon" },
      ],
    },
  ]);
});
test("Kuro's unqualified delayed choice retains the opponent Refresh restriction", () => {
  expect(
    buildCardEffects(
      "[On Play] Give up to 2 DON!! cards from your opponent's cost area to 1 of your opponent's Characters. Then, at the end of this turn, up to 1 rested Character with 3 or more DON!! cards given will not become active in your opponent's next Refresh Phase.",
    )?.effects?.[0]?.actions,
  ).toContainEqual({
    action: "delayed",
    timing: "endOfThisTurn",
    actions: [
      {
        action: "freeze",
        refreshPlayer: "opponent",
        target: {
          player: "any",
          zones: ["character"],
          count: { amount: 1, upTo: true },
          filters: [
            { filter: "state", value: "rested" },
            { filter: "attachedDon", comparison: "gte", value: 3 },
          ],
        },
      },
    ],
  });
});
test("Fire Fist requires the full optional discard before its K.O.", () => {
  expect(
    buildCardEffects(
      "[Main] Your Leader gains +3000 power during this turn and give up to 1 of your opponent's Characters -8000 power until the end of your opponent's next End Phase. Then, you may trash 2 cards from your hand. If you do, K.O. up to 1 of your opponent's Characters with 0 power or less.",
    )?.effects?.[0]?.actions,
  ).toContainEqual({
    action: "optional",
    actions: [
      expect.objectContaining({
        action: "trashFromHand",
        amount: 2,
        thenRequiresFullAmount: true,
        thenActions: [expect.objectContaining({ action: "ko" })],
      }),
    ],
  });
});
test("Amazon offers return only when the opponent has an active DON", () => {
  expect(
    buildCardEffects(
      "[On Your Opponent's Attack] You may rest this Character: Your opponent may return 1 of their active DON!! cards to their DON!! deck. If they do not, give up to 1 of your opponent's Leader or Character cards -2000 power during this turn.",
    )?.effects?.[0]?.actions,
  ).toEqual([
    expect.objectContaining({
      action: "conditional",
      predicate: { condition: "activeDonCount", player: "opponent", comparison: "gte", value: 1 },
      whenFalse: [expect.objectContaining({ action: "modifyPower" })],
    }),
  ]);
});
