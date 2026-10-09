import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";
const texts = {
  "P-036":
    "[When Attacking] You may add 1 card from the top or bottom of your Life cards to your hand: This Character and up to 1 of your Leader gain +1000 power during this turn.",
  "P-046":
    "[On Play] You may place all cards in your hand at the bottom of your deck in any order. If you do, draw cards equal to the number you placed at the bottom of your deck.",
  "P-051":
    "[When Attacking] You may trash any number of cards from your hand. This Character gains +1000 power during this battle for every card trashed.",
  "P-059":
    "[Counter] If your Leader is [Uta], you may return any number of Characters on your field to the owner's hand. Up to 1 of your Leader or Character cards gains +2000 power during this battle for every returned Character.",
  "P-071": "[On K.O.] You may add this Character card to your hand.",
  "P-076":
    "[Activate: Main] [Once Per Turn] You may trash 1 {Navy} type card from your hand: Give up to 1 of your opponent's Characters －1 cost during this turn.",
};
test("entire hand bottom ordering binds subsequent draw count", () => {
  expect(buildCardEffects(texts["P-046"])?.effects?.[0]).toMatchObject({
    optional: true,
    actions: [
      { action: "returnToDeck", position: "bottom", order: "any" },
      { action: "draw", amountFromPreviousActionTargets: true },
    ],
  });
});
test("any-number trash permits zero without declining the entire block", () => {
  const block = buildCardEffects(texts["P-051"])?.effects?.[0];
  expect(block?.optional).not.toBe(true);
  expect(block?.actions).toMatchObject([
    { action: "trashFromHand", amount: "all", upTo: true },
    { action: "modifyPower", valuePerPreviousActionTarget: 1000, duration: "thisBattle" },
  ]);
});
test("Uta Counter preserves Leader gate and actual return scaling", () => {
  expect(buildCardEffects(texts["P-059"])?.effects?.[0]).toMatchObject({
    conditions: [{ condition: "leaderName", name: "Uta" }],
    actions: [
      { action: "returnToHand", target: { count: { amount: "all", upTo: true } } },
      { action: "modifyPower", valuePerPreviousActionTarget: 2000 },
    ],
  });
});
test("Luffy self power does not depend on optional Leader recipient", () => {
  expect(buildCardEffects(texts["P-036"])?.effects?.[0]?.actions).toMatchObject([
    { action: "modifyPower", target: { self: true }, value: 1000 },
    {
      action: "modifyPower",
      target: { zones: ["leader"], count: { amount: 1, upTo: true } },
      value: 1000,
    },
  ]);
});
test("On KO self recovery uses trash", () => {
  expect(buildCardEffects(texts["P-071"])?.effects?.[0]).toMatchObject({
    optional: true,
    actions: [{ action: "returnToHand", target: { self: true, zones: ["trash"] } }],
  });
});
test("fullwidth minus retains cost reduction and exact Navy payment", () => {
  expect(buildCardEffects(texts["P-076"])?.effects?.[0]).toMatchObject({
    costs: [
      { cost: "trashFromHand", filters: [{ filter: "trait", value: "Navy", match: "exact" }] },
    ],
    actions: [{ action: "modifyCost", value: -1 }],
  });
});
