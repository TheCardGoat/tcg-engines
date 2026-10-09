import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";
const texts = {
  "ST32-001":
    "[On Play] You may rest your <Slash> attribute Leader or 1 of your DON!! cards: Draw 2 cards and trash 1 card from your hand. ",
  "ST32-003":
    "[Your Turn] When this Character becomes rested, draw 1 card and trash 1 card from your hand. [On Play] If your Leader has the <Slash> attribute, play up to 1 Character card with a cost of 5 or less that is either [Perona] or has the <Slash> attribute from your hand. ",
  "ST32-004":
    "If your Leader has the <Slash> attribute, this Character gains [Rush: Character]. (This card can attack Characters on the turn in which it is played.) [On Play] Rest up to 2 of your opponent's Characters with a cost of 2 or less. ",
  "ST32-005":
    "[Rush: Character] (This card can attack Characters on the turn in which it is played.) [On Play] If your Leader has the <Slash> attribute, rest up to 1 of your opponent's Characters with a cost of 2 or less. ",
  "ST33-004":
    "During the turn in which a card in your hand is trashed by an effect, give this card in your hand −3 cost. [Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) ",
  "ST34-004":
    "[On Play] DON!! −4, you may trash 1 card from your hand: Add up to 1 card from the top of your deck to the top of your Life cards. Then, up to 1 of your opponent's Characters' base power becomes 0 during this turn. ",
  "ST35-004":
    "This Character gains [Blocker] and +1 cost. [On Play] Give up to 1 rested DON!! card to your Leader. Then, play up to 1 Character card with 4000 power or less and the {Revolutionary Army} type from your hand or trash. ",
  "ST35-005":
    "This Character gains +3 cost. [On Play] Give up to 1 rested DON!! card to your Leader. Then, play up to 1 Character card with 4000 power or less and the {Revolutionary Army} type from your hand or trash. ",
  "ST36-003":
    "- [Trigger] Draw 1 card and your {Supernovas} type Leader's base power becomes 7000 during this turn.",
  "ST36-005":
    '[On Your Opponent\'s Attack] [Once Per Turn] You may turn 1 card from the top or bottom of your Life cards face-down: Change the target of the attack to your [Eustass"Captain"Kid] with 5000 base power or more. [Activate: Main] [Once Per Turn] You may turn 1 card from the top or bottom of your Life cards face-up: Give up to 1 rested DON!! card to your Leader. ',
};

test("Slash Leader and DON alternative payment retains the entire draw-discard body", () => {
  const b = buildCardEffects(texts["ST32-001"])?.effects?.[0];
  expect(b).toMatchObject({
    optional: true,
    alternativeCosts: [
      [
        {
          cost: "restCards",
          filters: [
            { filter: "cardCategory", value: "leader" },
            { filter: "attribute", value: "slash" },
          ],
        },
      ],
      [{ cost: "restDon", amount: 1 }],
    ],
    actions: [
      { action: "draw", amount: 2 },
      { action: "trashFromHand", amount: 1 },
    ],
  });
});
test("Mihawk keeps category and cost outside the name/attribute alternatives", () => {
  const b = buildCardEffects(texts["ST32-003"])?.effects?.find((e) => e.trigger === "onPlay");
  expect(b).toMatchObject({
    conditions: [{ condition: "leaderAttribute", attribute: "slash" }],
    actions: [
      {
        action: "play",
        filters: expect.arrayContaining([
          { filter: "cardCategory", value: "character" },
          { filter: "cost", comparison: "lte", value: 5 },
          {
            filter: "anyOf",
            filters: [
              { filter: "name", value: "Perona" },
              { filter: "attribute", value: "slash" },
            ],
          },
        ]),
      },
    ],
  });
});
test("angle bracket Slash conditions survive both keyword and triggered clauses", () => {
  expect(buildCardEffects(texts["ST32-004"])?.permanentEffects?.[0]).toMatchObject({
    conditions: [{ condition: "leaderAttribute", attribute: "slash" }],
    actions: [{ keyword: "rushCharacter" }],
  });
  expect(buildCardEffects(texts["ST32-005"])?.effects?.[0]).toMatchObject({
    conditions: [{ condition: "leaderAttribute", attribute: "slash" }],
    actions: [{ action: "rest" }],
  });
});
test("Borsalino uses player turn history and hand characteristic reduction", () => {
  expect(buildCardEffects(texts["ST33-004"])?.permanentEffects?.[0]).toMatchObject({
    conditions: [{ condition: "cardTrashedFromHandByEffectThisTurn", player: "self" }],
    actions: [{ action: "modifyCost", target: { zones: ["hand"], self: true }, value: -3 }],
  });
});
test("Linlin retains both costs and independent base-power setting after optional Life", () => {
  expect(buildCardEffects(texts["ST34-004"])?.effects?.[0]).toMatchObject({
    costs: [
      { cost: "returnDon", amount: 4 },
      { cost: "trashFromHand", amount: 1 },
    ],
    actions: [{ action: "addToLife" }, { action: "setBasePower", value: 0, duration: "thisTurn" }],
  });
});
test.each(["ST35-004", "ST35-005"] as const)(
  "%s mixed hand/trash play retains every filter",
  (id) => {
    const b = buildCardEffects(texts[id])?.effects?.find((e) => e.trigger === "onPlay");
    expect(b?.actions).toMatchObject([
      { action: "giveDon" },
      {
        action: "play",
        source: { zone: ["hand", "trash"] },
        filters: expect.arrayContaining([
          { filter: "cardCategory", value: "character" },
          { filter: "power", comparison: "lte", value: 4000 },
          { filter: "trait", value: "Revolutionary Army", match: "exact" },
        ]),
      },
    ]);
  },
);
test("Apoo Trigger-only draw and Leader base power both parse", () => {
  expect(buildCardEffects(texts["ST36-003"])?.effects?.[0]).toMatchObject({
    trigger: "trigger",
    actions: [
      { action: "draw", amount: 1 },
      {
        action: "setBasePower",
        value: 7000,
        target: {
          zones: ["leader"],
          filters: [{ filter: "trait", value: "Supernovas", match: "exact" }],
        },
      },
    ],
  });
});
test("Kid has two independent OPT edge payments and an exact named base-power redirect", () => {
  const b = buildCardEffects(texts["ST36-005"])?.effects;
  expect(b).toHaveLength(2);
  expect(b?.[0]).toMatchObject({
    trigger: "onOpponentAttack",
    oncePerTurn: true,
    optional: true,
    costs: [{ cost: "turnLifeFaceUp", count: 1, faceUp: false, position: "choice" }],
    actions: [
      {
        action: "changeBattleTarget",
        target: {
          zones: ["leader", "character"],
          filters: [
            { filter: "name", value: 'Eustass"Captain"Kid' },
            { filter: "basePower", comparison: "gte", value: 5000 },
          ],
        },
      },
    ],
  });
  expect(b?.[1]).toMatchObject({
    trigger: "activateMain",
    oncePerTurn: true,
    costs: [{ cost: "turnLifeFaceUp", faceUp: true, position: "choice" }],
  });
});
