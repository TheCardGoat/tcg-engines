import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";
const texts = {
  "P-077":
    "[Once Per Turn] When 2 or more DON!! cards on your field are returned to your DON!! deck, add up to 1 DON!! card from your DON!! deck and rest it. Then, set up to 1 of your purple Stages as active.",
  "P-091":
    "[On Play] Play up to 1 {Neptunian} or {Fish-Man Island} type Character card with a cost of 5 or less from your hand. [Activate: Main] You may rest this Character: Up to 1 of your {Neptunian} type Characters can attack Characters on the turn in which it is played.",
  "P-100":
    "[When Attacking] Negate the effects of your opponent's Leader and all of their Characters during this turn.",
  "P-104":
    "If either you or your opponent has 10 DON!! cards on the field, this Character cannot be removed from the field by your opponent's effects.",
  "P-117":
    "Under the rules of this game, you can only include {East Blue} type cards in your deck and when your deck is reduced to 0, you win the game instead of losing. [DON!! x1] When this Leader's attack deals damage to your opponent's Life, you may trash 1 card from the top of your deck.",
};
test("returned DON timing captures simultaneous minimum", () => {
  expect(buildCardEffects(texts["P-077"])?.effects?.[0]).toMatchObject({
    eventFilter: { minimumAmount: 2 },
    oncePerTurn: true,
  });
});
test("selected trait Character gets Character-only Rush after rest cost", () => {
  expect(buildCardEffects(texts["P-091"])?.effects?.[1]).toMatchObject({
    optional: true,
    costs: [{ cost: "restThisCard" }],
    actions: [
      {
        action: "grantKeyword",
        keyword: "rushCharacter",
        duration: "thisTurn",
        target: { filters: [{ filter: "trait", value: "Neptunian", match: "exact" }] },
      },
    ],
  });
});
test("Leader and every opposing Character are negated", () => {
  expect(buildCardEffects(texts["P-100"])?.effects?.[0]?.actions).toMatchObject([
    {
      action: "negateEffects",
      target: { player: "opponent", zones: ["leader", "character"], count: { amount: "all" } },
      duration: "thisTurn",
    },
  ]);
});
test("either player's exact ten DON enables protection", () => {
  expect(buildCardEffects(texts["P-104"])?.permanentEffects?.[0]).toMatchObject({
    conditions: [
      {
        condition: "compound",
        operator: "or",
        conditions: [
          { player: "self", comparison: "eq", value: 10 },
          { player: "opponent", comparison: "eq", value: 10 },
        ],
      },
    ],
    actions: [{ action: "cannotBeRemoved", bySource: "opponentEffect" }],
  });
});
test("only-trait deck rule coexists with deck loss replacement and damage timing", () => {
  expect(buildCardEffects(texts["P-117"])).toMatchObject({
    deckBuildingRules: [
      {
        rule: "cannotInclude",
        filters: [{ filter: "trait", value: "East Blue", match: "exact", negate: true }],
      },
    ],
    replacementEffects: [{ replacedEvent: "loseGame", replacementAction: { action: "winGame" } }],
    effects: [
      {
        trigger: "whenDealsDamage",
        conditions: [{ condition: "donAttached", amount: 1 }],
        optional: true,
      },
    ],
  });
});
