import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";
const printed = {
  "ST10-002":
    "[Activate: Main] [Once Per Turn] If you have 0 DON!! cards on your field or 8 or more DON!! cards on your field, add up to 1 DON!! card from your DON!! deck and set it as active.",
  "ST10-004":
    "[On Play] If your opponent has a Character with 5000 or more power, this Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)",
  "ST10-006":
    "[Rush] (This card can attack on the turn in which it is played.) [Once Per Turn] When your opponent activates a [Blocker], K.O. up to 1 of your opponent's Characters with 8000 power or less.",
  "ST10-009":
    "[On Play] \u2780 (You may rest the specified number of DON!! cards in your cost area.): Add up to 1 DON!! card from your DON!! deck and set it as active.",
  "ST11-001":
    "[DON!! x1] [When Attacking] [Once Per Turn] Reveal 1 card from the top of your deck and add up to 1 {FILM} type card to your hand. Then, place the rest at the bottom of your deck.",
  "ST12-003":
    "[On Play] If you have 2 or less Characters, play up to 1 {Muggy Kingdom} type or <Slash> attribute Character card with a cost of 4 or less other than [Dracule Mihawk] from your hand rested.",
  "ST12-007":
    "[On Play] \u2781 (You may rest the specified number of DON!! cards in your cost area.): If your opponent has 3 or more Life cards, set up to 1 of your <Slash> attribute Characters with a cost of 4 or less as active.",
  "ST12-013":
    "[On Play] Look at 3 cards from the top of your deck and place them at the top or bottom of the deck in any order. [When Attacking] Reveal 1 card from the top of your deck and play up to 1 Character card with a cost of 2 rested. Then, place the rest at the top or bottom of your deck.",
};

test("Luffy preserves both DON count alternatives", () => {
  expect(buildCardEffects(printed["ST10-002"])?.effects?.[0]).toMatchObject({
    trigger: "activateMain",
    oncePerTurn: true,
    conditions: [
      {
        condition: "compound",
        operator: "or",
        conditions: [
          { condition: "donFieldCount", comparison: "eq", value: 0 },
          { condition: "donFieldCount", comparison: "gte", value: 8 },
        ],
      },
    ],
    actions: [{ action: "addDon", state: "active" }],
  });
});
test("Sanji checks opposing current power at On Play", () => {
  expect(buildCardEffects(printed["ST10-004"])?.effects?.[0]).toMatchObject({
    trigger: "onPlay",
    conditions: [
      {
        condition: "hasCard",
        player: "opponent",
        filters: [{ filter: "power", comparison: "gte", value: 5000 }],
      },
    ],
    actions: [{ action: "grantKeyword", keyword: "rush", duration: "thisTurn" }],
  });
});
test("Luffy reacts to opposing Blocker without gaining Blocker", () => {
  const parsed = buildCardEffects(printed["ST10-006"]);
  expect(parsed?.keywords).toEqual(["rush"]);
  expect(parsed?.effects?.[0]).toMatchObject({
    trigger: "whenBlockerActivated",
    eventFilter: { player: "opponent" },
    oncePerTurn: true,
  });
});
test.each([
  ["ST10-009", 1],
  ["ST12-007", 2],
] as const)("outlined DON cost %s is optional", (id, amount) => {
  expect(buildCardEffects(printed[id])?.effects?.[0]).toMatchObject({
    trigger: "onPlay",
    optional: true,
    costs: [{ cost: "restDon", amount }],
  });
});
test("Uta publicly reveals before optional FILM hand addition and bottom remainder", () => {
  expect(buildCardEffects(printed["ST11-001"])?.effects?.[0]?.actions).toMatchObject([
    {
      action: "revealTopDeckCard",
      conditional: {
        filters: [{ filter: "trait", value: "FILM", match: "exact" }],
        actions: [
          {
            action: "search",
            lookCount: 1,
            revealCount: { amount: 1, upTo: true },
            revealDestination: "hand",
          },
        ],
      },
      finalPosition: "bottom",
    },
  ]);
});
test("Mihawk retains Slash OR Muggy Kingdom and shared play limits", () => {
  expect(buildCardEffects(printed["ST12-003"])?.effects?.[0]?.actions).toMatchObject([
    {
      action: "play",
      playState: "rested",
      filters: expect.arrayContaining([
        { filter: "cost", comparison: "lte", value: 4 },
        { filter: "excludeName", value: "Dracule Mihawk" },
        {
          filter: "anyOf",
          filters: [
            { filter: "trait", value: "Muggy Kingdom", match: "exact" },
            { filter: "attribute", value: "slash" },
          ],
        },
      ]),
    },
  ]);
});
test("Zeff plays only the revealed cost-two Character rested", () => {
  expect(buildCardEffects(printed["ST12-013"])?.effects?.[1]?.actions).toMatchObject([
    {
      action: "revealTopDeckCard",
      conditional: {
        filters: expect.arrayContaining([
          { filter: "cost", comparison: "eq", value: 2 },
          { filter: "cardCategory", value: "character" },
        ]),
        actions: [{ action: "play", topOnly: true, playState: "rested" }],
      },
      finalPosition: "choice",
    },
  ]);
});
