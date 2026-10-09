import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

test("a later optional DON rest does not make the earlier Counter boost optional", () => {
  const block = buildCardEffects(
    "[Counter] Up to 1 of your Characters or [Silvers Rayleigh] gains +2000 power during this battle. Then, you may rest 1 of your DON!! cards. If you do, give your opponent's Leader and all of their Characters -1000 power during this turn.",
  )?.effects?.[0];
  expect(block?.optional).toBeUndefined();
  expect(block?.costs).toBeUndefined();
  expect(block?.actions).toHaveLength(2);
  expect(block?.actions[0]).toMatchObject({
    action: "modifyPower",
    value: 2000,
    target: { zones: ["leader", "character"] },
  });
  expect(block?.actions[1]).toMatchObject({
    action: "optional",
    condition: { condition: "activeDonCount", comparison: "gte", value: 1 },
    actions: [
      {
        action: "rest",
        target: { zones: ["costArea"], filters: [{ filter: "state", value: "active" }] },
      },
      {
        action: "modifyPower",
        value: -1000,
        duration: "thisTurn",
        target: { player: "opponent", zones: ["leader", "character"], count: { amount: "all" } },
      },
    ],
  });
});

test("Zoro's effect-play restriction retains its hand-only source zone", () => {
  expect(
    buildCardEffects("This card in your hand cannot be played by effects.")?.permanentEffects?.[0]
      ?.actions,
  ).toEqual([{ action: "cannotBePlayedByEffects", sourceZones: ["hand"] }]);
});

test("look-and-add search does not reveal its selected hand card", () => {
  expect(
    buildCardEffects(
      "[Main] Look at 3 cards from the top of your deck and add up to 1 card to your hand. Then, place the rest at the bottom of your deck in any order.",
    )?.effects?.[0]?.actions[0],
  ).toMatchObject({ action: "search", reveal: false, revealDestination: "hand" });
});
