import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";
const texts = {
  "ST29-016":
    "[Main] Your [Monkey.D.Luffy] Leader gains [Unblockable] during this turn. (This card cannot be blocked.) [Counter] Your Leader gains +3000 power during this battle. ",
  "ST30-001":
    "If you have a Character with 7000 base power or more, give this Leader −2000 power. [Opponent's Turn] All of your [Portgas.D.Ace] and [Monkey.D.Luffy] cards gain +3000 power. ",
  "ST30-004":
    "[On Play] You may reveal 2 Character cards with 6000 power from your hand: Draw 3 cards and trash 2 cards from your hand. ",
  "ST30-009":
    "If your Character with 6000 base power would be removed from the field by your opponent's effect, you may trash this Character and draw 1 card instead. ",
  "ST30-014":
    "[Activate: Main] You may rest this Character: Give up to 2 of your Characters with 6000 base power up to 2 rested DON!! cards each. ",
  "ST30-015":
    "[Counter] If you have 2 or more Characters with 6000 base power, up to 1 of your Leader or Character cards gains +4000 power during this battle. [Trigger] K.O. up to 1 of your opponent's Characters with 6000 power or less.",
  "ST30-016":
    "[Counter] Up to 1 of your Leader or Character cards gains +3000 power during this battle. Then, if you have [Portgas.D.Ace] and [Monkey.D.Luffy] Characters with 6000 base power, draw 1 card. ",
};
test("named Leader Unblockable retains Main and Counter", () => {
  const p = buildCardEffects(texts["ST29-016"]);
  expect(p?.effects?.map((b) => b.trigger)).toEqual(["main", "counter"]);
  expect(p?.effects?.[0]?.actions[0]).toMatchObject({
    action: "grantKeyword",
    keyword: "unblockable",
    target: { zones: ["leader"], filters: [{ filter: "name", value: "Monkey.D.Luffy" }] },
  });
});
test("Leader base-power gate and opponent turn named bonuses remain separate", () => {
  const p = buildCardEffects(texts["ST30-001"]);
  expect(p?.permanentEffects).toHaveLength(2);
});
test("reveal cost requires two power6000 Characters", () => {
  const p = buildCardEffects(texts["ST30-004"]);
  expect(p?.effects?.[0]?.costs).toEqual([
    {
      cost: "revealFromHand",
      amount: 2,
      filters: [
        { filter: "cardCategory", value: "character" },
        { filter: "power", comparison: "eq", value: 6000 },
      ],
    },
  ]);
});
test("Oars uses a compound replacement not a permanent draw", () => {
  const p = buildCardEffects(texts["ST30-009"]);
  expect(p?.replacementEffects?.[0]).toMatchObject({
    replacedEvent: "removeFromField",
    source: "opponentEffect",
    target: { filters: [{ filter: "basePower", comparison: "eq", value: 6000 }] },
    replacementAction: {
      action: "sequence",
      actions: [{ action: "trashThisCard" }, { action: "draw", player: "self", amount: 1 }],
    },
  });
  expect(p?.permanentEffects).toBeUndefined();
});
test("Galdino retains optional self rest and independent per-recipient DON bounds", () => {
  const b = buildCardEffects(texts["ST30-014"])?.effects?.[0];
  expect(b).toMatchObject({
    trigger: "activateMain",
    optional: true,
    costs: [{ cost: "restThisCard" }],
    actions: [
      {
        action: "giveDon",
        donState: "rested",
        distribution: "each",
        target: {
          count: { amount: 2, upTo: true },
          filters: [{ filter: "basePower", comparison: "eq", value: 6000 }],
        },
        count: { amount: 2, upTo: true },
      },
    ],
  });
});
test("Counter condition counts base6000 and Trigger remains independent", () => {
  const p = buildCardEffects(texts["ST30-015"]);
  expect(p?.effects?.map((b) => b.trigger)).toEqual(["counter", "trigger"]);
  expect(p?.effects?.[0]?.conditions).toEqual([
    {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: "gte",
      value: 2,
      filters: [{ filter: "basePower", comparison: "eq", value: 6000 }],
    },
  ]);
});
test("trailing draw needs both exact named base6000 Characters", () => {
  const a = buildCardEffects(texts["ST30-016"])?.effects?.[0]?.actions;
  expect(a?.map((x) => x.action)).toEqual(["modifyPower", "draw"]);
  expect(a?.[1]).toMatchObject({
    condition: {
      condition: "compound",
      operator: "and",
      conditions: [
        {
          condition: "hasCard",
          filters: [
            { filter: "name", value: "Portgas.D.Ace" },
            { filter: "basePower", comparison: "eq", value: 6000 },
          ],
        },
        {
          condition: "hasCard",
          filters: [
            { filter: "name", value: "Monkey.D.Luffy" },
            { filter: "basePower", comparison: "eq", value: 6000 },
          ],
        },
      ],
    },
  });
});
