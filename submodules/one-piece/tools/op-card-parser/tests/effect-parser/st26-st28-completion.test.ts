import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

const soba =
  "If you have a [San-Gorou] or [Sanji] Character with 7000 base power or more, give this card in your hand −5 cost. [On Play] Return all of your [San-Gorou] and [Sanji] Characters to the owner's hand.";
const wolf =
  "If your Leader has the {Blackbeard Pirates} type, this Character gains [Blocker] and +1 cost for every 4 cards in your trash. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Trash 1 card from your hand.";
const momo =
  "[Your Turn] If you have 2 or less Life cards, your Leader gains +1000 power. [Activate: Main] [Once Per Turn] You may return 2 total of your currently given DON!! cards to your cost area rested: This Character gains [Rush] and +1000 power during this turn. (This card can attack on the turn in which it is played.)";

test("Soba Mask combines either name with base power and returns all matching Characters", () => {
  const parsed = buildCardEffects(soba);
  expect(parsed?.permanentEffects?.[0]?.conditions).toContainEqual({
    condition: "hasCard",
    player: "self",
    zone: "character",
    filters: [
      {
        filter: "anyOf",
        filters: [
          { filter: "name", value: "San-Gorou" },
          { filter: "name", value: "Sanji" },
        ],
      },
      { filter: "basePower", comparison: "gte", value: 7000 },
    ],
  });
  expect(parsed?.permanentEffects?.[0]?.actions).toContainEqual(
    expect.objectContaining({
      action: "modifyCost",
      value: -5,
      target: expect.objectContaining({ self: true, zones: ["hand"] }),
    }),
  );
  expect(parsed?.effects?.[0]?.actions).toEqual([
    {
      action: "returnToHand",
      target: {
        player: "self",
        zones: ["character"],
        count: { amount: "all" },
        filters: [
          {
            filter: "anyOf",
            filters: [
              { filter: "name", value: "San-Gorou" },
              { filter: "name", value: "Sanji" },
            ],
          },
        ],
      },
    },
  ]);
});

test("Wolf gates Blocker by Leader alone and scales only cost by complete trash groups", () => {
  const parsed = buildCardEffects(wolf);
  expect(parsed?.permanentEffects?.[0]?.conditions).toEqual([
    { condition: "leaderTrait", trait: "Blackbeard Pirates", match: "exact" },
  ]);
  expect(parsed?.permanentEffects?.[0]?.actions).toEqual([
    expect.objectContaining({ action: "grantKeyword", keyword: "blocker" }),
    expect.objectContaining({
      action: "modifyCost",
      value: 1,
      valuePerCardGroup: {
        size: 4,
        target: { player: "self", zones: ["trash"], count: { amount: "all" } },
      },
    }),
  ]);
  expect(parsed?.effects?.[0]?.actions).toEqual([
    { action: "trashFromHand", player: "self", amount: 1 },
  ]);
});

test("Momonosuke preserves the optional attached-DON activation separately from its Life permanent", () => {
  const parsed = buildCardEffects(momo);
  expect(parsed?.permanentEffects).toHaveLength(1);
  expect(parsed?.effects).toHaveLength(1);
  expect(parsed?.effects?.[0]).toMatchObject({
    trigger: "activateMain",
    optional: true,
    oncePerTurn: true,
    costs: [{ cost: "returnDon", amount: 2, donState: "attached", destination: "costAreaRested" }],
    actions: [
      { action: "grantKeyword", keyword: "rush", duration: "thisTurn" },
      { action: "modifyPower", value: 1000, duration: "thisTurn" },
    ],
  });
});
