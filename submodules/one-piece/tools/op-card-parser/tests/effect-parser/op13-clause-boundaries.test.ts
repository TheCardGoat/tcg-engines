import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

test("only Leader attacks bypass Blocker after the optional rest cost", () => {
  expect(
    buildCardEffects(
      "[Main] You may rest 1 of your DON!! cards: If you have 1 or less Life cards, your opponent cannot activate [Blocker] whenever your Leader attacks during this turn.",
    )?.effects?.[0],
  ).toMatchObject({
    costs: [{ cost: "restDon", amount: 1 }],
    actions: [
      {
        action: "grantKeyword",
        keyword: "unblockable",
        target: { player: "self", zones: ["leader"] },
        condition: { condition: "lifeCount", value: 1 },
      },
    ],
  });
});

test("Shanks prohibits command play from hand while allowing effect play per the FAQ", () => {
  expect(
    buildCardEffects(
      "[On Play] Set all of your DON!! cards as active. Then, you cannot play cards from your hand during this turn.",
    )?.effects?.[0]?.actions[1],
  ).toMatchObject({ action: "playRestriction", sourceZones: ["hand"], origin: "command" });
});

test("Ju Peter has continuous base-power setting with both turn and trash gates", () => {
  expect(
    buildCardEffects(
      "[Your Turn] If you have 10 or more cards in your trash, set the base power of all of your {Five Elders} type Characters to 7000.",
    )?.permanentEffects?.[0],
  ).toMatchObject({
    conditions: [
      { condition: "turn", value: "your" },
      { condition: "zoneCount", zone: "trash", comparison: "gte", value: 10 },
    ],
    actions: [
      {
        action: "setBasePower",
        value: 7000,
        duration: "permanent",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: "all" },
          filters: [{ filter: "trait", value: "Five Elders" }],
        },
      },
    ],
  });
});

test("Imu retains its deck restriction and pre-opening-hand Stage instruction", () => {
  expect(
    buildCardEffects(
      "Under the rules of this game, you cannot include Events with a cost of 2 or more in your deck and at the start of the game, play up to 1 {Mary Geoise} type Stage card from your deck.",
    ),
  ).toMatchObject({
    deckBuildingRules: [
      {
        rule: "cannotInclude",
        filters: [
          { filter: "cardCategory", value: "event" },
          { filter: "cost", comparison: "gte", value: 2 },
        ],
      },
    ],
    startOfGame: {
      playStageFromDeck: { filters: [{ filter: "trait", value: "Mary Geoise", match: "exact" }] },
    },
  });
});
