import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";
const texts = {
  "P-007":
    "[DON!! x1] This Character cannot be K.O.'d in battle by ＜Strike＞ attribute Leaders or Characters.",
  "P-009":
    "[On Play] If your opponent has 6 or more cards in their hand, your opponent adds 1 card from their Life area to their hand.",
  "P-011":
    "[Activate: Main] [Once Per Turn] ① (You may rest the specified number of DON!! cards in your cost area.): Up to 1 of your Characters with no base effect gains +2000 power during this turn.",
};

test("fullwidth Strike battle immunity includes both opposing card categories", () => {
  expect(buildCardEffects(texts["P-007"])?.permanentEffects?.[0]).toMatchObject({
    conditions: [{ condition: "donAttached", amount: 1 }],
    actions: [
      {
        action: "cannotBeKod",
        restriction: "inBattle",
        byFilter: [{ filter: "attribute", value: "strike" }],
      },
    ],
  });
});
test("opponent hand gate and unqualified Life-area removal retain owner and mandatory count", () => {
  expect(buildCardEffects(texts["P-009"])?.effects?.[0]).toMatchObject({
    conditions: [{ condition: "handCount", player: "opponent", comparison: "gte", value: 6 }],
    actions: [
      { action: "removeFromLife", player: "opponent", count: { amount: 1 }, destination: "hand" },
    ],
  });
});
test("circled optional DON rest cost preserves decline and OPT", () => {
  expect(buildCardEffects(texts["P-011"])?.effects?.[0]).toMatchObject({
    optional: true,
    oncePerTurn: true,
    costs: [{ cost: "restDon", amount: 1 }],
    actions: [{ action: "modifyPower", value: 2000 }],
  });
});
