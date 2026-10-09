import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

test("Zephyr gains power after actually battling a Strike Character on either side", () => {
  expect(
    buildCardEffects(
      "When this Character battles ＜Strike＞ attribute Characters, this Character gains +3000 power during this turn. [Activate: Main] [Once Per Turn] DON!! −1: This Character gains +2000 power during this turn.",
    )?.effects,
  ).toMatchObject([
    {
      trigger: "endOfBattle",
      eventFilter: {
        battlePowerCompared: true,
        anyOf: [
          {
            sourceSelf: true,
            targetFilters: [
              { filter: "cardCategory", value: "character" },
              { filter: "attribute", value: "strike" },
            ],
          },
          {
            targetSelf: true,
            sourceFilters: [
              { filter: "cardCategory", value: "character" },
              { filter: "attribute", value: "strike" },
            ],
          },
        ],
      },
      actions: [{ action: "modifyPower", value: 3000, duration: "thisTurn" }],
    },
    { trigger: "activateMain", costs: [{ cost: "returnDon", amount: 1 }], oncePerTurn: true },
  ]);
});

test("Union Armada protects only its prior power recipient when it is a Character", () => {
  expect(
    buildCardEffects(
      "[Counter] Up to 1 of your {FILM} type Leader or Character cards gains +4000 power during this battle. If that card is a Character, that Character cannot be K.O.'d during this turn.",
    )?.effects?.[0]?.actions,
  ).toMatchObject([
    { action: "modifyPower", value: 4000 },
    {
      action: "cannotBeKod",
      previousActionTargets: true,
      condition: {
        condition: "previousActionTarget",
        filters: [{ filter: "cardCategory", value: "character" }],
      },
      duration: "thisTurn",
    },
  ]);
});

test("Lion retains the optional DON-return cost after committing its Main Event", () => {
  expect(
    buildCardEffects(
      "[Main] DON!! −2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
    )?.effects?.[0],
  ).toMatchObject({ trigger: "main", costs: [{ cost: "returnDon", amount: 2 }], optional: true });
});
