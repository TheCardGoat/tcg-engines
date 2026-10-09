import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

test("an unpaid leading If gates the draw and later Then action", () => {
  const effects = buildCardEffects(
    "[Main] If your Leader is multicolored, draw 1 card. Then, return up to 1 Character with a cost of 5 or less to the owner's hand.",
  );
  expect(effects?.effects?.[0]).toMatchObject({
    conditions: [{ condition: "leaderMulticolored" }],
    actions: [{ action: "draw" }, { action: "returnToHand" }],
  });
});

test("a paid leading If is checked after payment and gates the whole sequence once", () => {
  const effects = buildCardEffects(
    "[Main] DON!! -1: If your Leader is [Enel], draw 1 card. Then, up to 1 of your Characters gains +2 cost until the end of your opponent's next End Phase.",
  );
  expect(effects?.effects?.[0]).toMatchObject({
    costs: [{ cost: "returnDon", amount: 1 }],
    actions: [
      {
        action: "conditional",
        predicate: { condition: "leaderName", name: "Enel" },
        whenTrue: [{ action: "draw" }, { action: "modifyCost" }],
      },
    ],
  });
  expect(effects?.effects?.[0]?.conditions).toBeUndefined();
});

test("a deck-trash payment stays outside a failed post-cost gate", () => {
  const effects = buildCardEffects(
    "[Main] You may trash 2 cards from the top of your deck: If your Leader is [Enel], draw 1 card. Then, up to 1 of your Characters gains +1000 power during this turn.",
  );
  expect(effects?.effects?.[0]).toMatchObject({
    conditions: [{ condition: "zoneCount", zone: "deck", comparison: "gte", value: 2 }],
    actions: [
      { action: "trashFromDeck", player: "self", amount: 2 },
      {
        action: "conditional",
        predicate: { condition: "leaderName", name: "Enel" },
        whenTrue: [{ action: "draw" }, { action: "modifyPower" }],
      },
    ],
  });
});

test("a return-to-deck payment shuffles before the post-cost condition", () => {
  const effects = buildCardEffects(
    "[Main] You may return 2 Character cards from your trash to your deck and shuffle it: If your Leader is [Enel], draw 1 card. Then, up to 1 of your Characters gains +1000 power during this turn.",
  );
  expect(effects?.effects?.[0]).toMatchObject({
    costs: [{ cost: "returnTrashToDeck", amount: 2 }],
    actions: [
      { action: "shuffleDeck", player: "self" },
      {
        action: "conditional",
        predicate: { condition: "leaderName", name: "Enel" },
        whenTrue: [{ action: "draw" }, { action: "modifyPower" }],
      },
    ],
  });
});
