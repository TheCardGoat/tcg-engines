import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

test("one bottom-deck instruction preserves independent target groups", () => {
  const effects = buildCardEffects(
    "[On Play] You may trash 1 card from your hand: Place up to 1 of your opponent's Characters with 4000 base power or less and up to 1 Character with a base cost of 3 or less at the bottom of the owner's deck.",
  );
  expect(effects?.effects?.[0]?.actions).toMatchObject([
    {
      action: "returnToDeck",
      position: "bottom",
      targetGroups: [
        { player: "opponent", filters: [{ filter: "basePower", comparison: "lte", value: 4000 }] },
        { player: "any", filters: [{ filter: "baseCost", comparison: "lte", value: 3 }] },
      ],
    },
  ]);
});

test("one K.O. instruction preserves two printed target limits", () => {
  const effects = buildCardEffects(
    "[On Play] K.O. up to 1 of your opponent's Characters with a cost of 2 or less and up to 1 of your opponent's Characters with a cost of 1 or less.",
  );
  expect(effects?.effects?.[0]?.actions).toMatchObject([
    {
      action: "ko",
      targetGroups: [
        {
          count: { amount: 1, upTo: true },
          filters: [{ filter: "cost", comparison: "lte", value: 2 }],
        },
        {
          count: { amount: 1, upTo: true },
          filters: [{ filter: "cost", comparison: "lte", value: 1 }],
        },
      ],
    },
  ]);
});

test("a later Then action follows the complete grouped removal", () => {
  const effects = buildCardEffects(
    "[Main] K.O. up to 1 of your opponent's Characters with a cost of 2 or less and up to 1 of your opponent's Characters with a cost of 1 or less. Then, draw 1 card.",
  );
  expect(effects?.effects?.[0]?.actions).toMatchObject([
    { action: "ko", targetGroups: [{ count: { amount: 1 } }, { count: { amount: 1 } }] },
    { action: "draw", player: "self", amount: 1 },
  ]);
});
