import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

test("Law swaps only the two printed alternative Character types", () => {
  expect(
    buildCardEffects(
      "[Activate: Main] [Once Per Turn] Select 2 of your {Supernovas} or {Heart Pirates} type Characters. Swap the base power of the selected Characters with each other during this turn.",
    )?.effects?.[0]?.actions[0],
  ).toMatchObject({
    action: "swapBasePower",
    target: {
      player: "self",
      count: { amount: 2 },
      filters: [
        {
          filter: "anyOf",
          filters: [
            { filter: "trait", value: "Supernovas", match: "exact" },
            { filter: "trait", value: "Heart Pirates", match: "exact" },
          ],
        },
      ],
    },
  });
});

test("Bullet String gates both bonuses after the DON cost and reuses the selected card", () => {
  expect(
    buildCardEffects(
      "[Counter] DON!! -1: If your Leader has the {Donquixote Pirates} type, up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, that card gains an additional +2000 power during this turn.",
    )?.effects?.[0],
  ).toMatchObject({
    costs: [{ cost: "returnDon", amount: 1 }],
    actions: [
      {
        action: "conditional",
        predicate: { condition: "leaderTrait", trait: "Donquixote Pirates" },
        whenTrue: [
          { action: "modifyPower", value: 2000, duration: "thisBattle" },
          {
            action: "modifyPower",
            value: 2000,
            duration: "thisTurn",
            previousActionTargets: true,
            target: { zones: ["leader", "character"] },
          },
        ],
      },
    ],
  });
});

test("Mihawk retains opposing Leader attribute and gates both DON activation and play restriction", () => {
  expect(
    buildCardEffects(
      "If your opponent's Leader has the <Slash> attribute, this Leader gains +1000 power.\n[Activate: Main] [Once Per Turn] You may rest 1 of your cards: If there is a Character with a cost of 5 or more, set up to 3 of your DON!! cards as active. Then, you cannot play Character cards during this turn.",
    ),
  ).toMatchObject({
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "opponent",
            zone: "leader",
            filters: [{ filter: "attribute", value: "slash" }],
          },
        ],
        actions: [{ action: "modifyPower", value: 1000 }],
      },
    ],
    effects: [
      {
        costs: [{ cost: "restCards", amount: 1 }],
        actions: [
          {
            action: "conditional",
            whenTrue: [{ action: "setActive" }, { action: "playRestriction" }],
          },
        ],
      },
    ],
  });
});
