import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

test("named DON!! costs retain the recipient restriction", () => {
  const effects = buildCardEffects(
    "[Main] You may give 1 active DON!! card to 1 of your [Silvers Rayleigh]: Give up to 1 of your opponent's Characters -2000 power during this turn.",
  );
  expect(effects?.effects?.[0]).toMatchObject({
    trigger: "main",
    optional: true,
    costs: [
      {
        cost: "giveDon",
        amount: 1,
        recipientFilters: [{ filter: "name", value: "Silvers Rayleigh" }],
      },
    ],
    actions: [{ action: "modifyPower", value: -2000 }],
  });
});

test("a may-add-Life choice remains optional after a Then condition", () => {
  const effects = buildCardEffects(
    "[Activate: Main] [Once Per Turn] Give up to 1 of your opponent's Characters -1000 power during this turn. Then, if you have 2 or more Life cards, you may add 1 card from the top of your Life cards to your hand.",
  );
  expect(effects?.effects?.[0]?.actions[1]).toMatchObject({
    action: "removeFromLife",
    count: { amount: 1, upTo: true },
    destination: "hand",
    position: "top",
    condition: { condition: "lifeCount", comparison: "gte", value: 2 },
  });
});

test("named Leader or any Character Counter keeps the alternative target", () => {
  const effects = buildCardEffects(
    "[Counter] Up to 1 of your Characters or [Silvers Rayleigh] gains +2000 power during this battle.",
  );
  expect(effects?.effects?.[0]?.actions[0]).toMatchObject({
    action: "modifyPower",
    target: {
      player: "self",
      zones: ["leader", "character"],
      filters: [
        {
          filter: "anyOf",
          filters: [
            { filter: "cardCategory", value: "character" },
            { filter: "name", value: "Silvers Rayleigh" },
          ],
        },
      ],
    },
    value: 2000,
    duration: "thisBattle",
  });
});

test("Blocker prevention binds to the physical DON!! cost recipient", () => {
  const effects = buildCardEffects(
    "[Main] You may give 2 active DON!! cards to 1 of your [Silvers Rayleigh]: Your opponent cannot activate [Blocker] when the card given these DON!! cards attacks during this turn.",
  );
  expect(effects?.effects?.[0]?.actions).toMatchObject([
    {
      action: "grantKeyword",
      keyword: "unblockable",
      duration: "thisTurn",
      previousActionTargets: true,
      target: { player: "self", zones: ["leader", "character"] },
    },
  ]);
});
