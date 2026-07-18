import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP05-053 through OP05-056 parser regressions", () => {
  test("maps drawing outside the Draw Phase to its dedicated trigger", () => {
    expect(
      buildCardEffects(
        "[Your Turn][Once Per Turn] When you draw a card outside of your Draw Phase, this Character gains +2000 power during this turn.",
      ),
    ).toMatchObject({
      effects: [{ trigger: "whenCardDrawn", oncePerTurn: true }],
    });
  });

  test("parses X.Barrels' other-Character deck-bottom payment", () => {
    expect(
      buildCardEffects(
        "[On Play] You may place 1 of your Characters other than this Character at the bottom of your deck: Draw 1 card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [
            {
              cost: "returnCharacterToDeck",
              amount: 1,
              position: "bottom",
              player: "self",
              filters: [{ filter: "excludeSelf" }],
            },
          ],
          actions: [{ action: "draw", player: "self", amount: 1 }],
          optional: true,
        },
      ],
    });
  });
});

describe("OP05-087 and OP05-088 parser regressions", () => {
  test("maps Hakuba's other-Character K.O. payment", () => {
    expect(
      buildCardEffects(
        "[DON!! x1][When Attacking] You may K.O. 1 of your Characters other than this Character: Give up to 1 of your opponent's Characters -5 cost during this turn.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "whenAttacking",
          costs: [{ cost: "koCharacter", amount: 1, filters: [{ filter: "excludeSelf" }] }],
          optional: true,
        },
      ],
    });
  });

  test("keeps Mansherry's inclusive Character cost range", () => {
    const generated = buildCardEffects(
      "[Activate:Main] (1) (You may rest the specified number of DON!! cards in your cost area.) You may rest this Character and place 2 cards from your trash at the bottom of your deck in any order: Add up to 1 black Character card with a cost of 3 to 5 from your trash to your hand.",
    );
    expect(generated?.effects?.[0]?.actions?.[0]).toMatchObject({
      action: "returnToHand",
      target: {
        filters: [
          { filter: "color", value: "black" },
          { filter: "cardCategory", value: "character" },
          { filter: "cost", comparison: "gte", value: 3 },
          { filter: "cost", comparison: "lte", value: 5 },
        ],
      },
    });
  });
});

describe("OP05-079 through OP05-092 shared parser regressions", () => {
  test("assigns Viola's trash order to the opponent", () => {
    expect(
      buildCardEffects(
        "[On Play] Your opponent places 3 cards from their trash at the bottom of their deck in any order.",
      )?.effects?.[0]?.actions?.[0],
    ).toMatchObject({
      action: "returnToDeck",
      target: { player: "opponent", chosenBy: "opponent" },
    });
  });

  test("keeps Elizabello's twenty-card payment and shuffle", () => {
    expect(
      buildCardEffects(
        "[When Attacking] [Once Per Turn] You may return 20 cards from your trash to your deck and shuffle it: This Character gains [Double Attack] and +10000 power during this battle. (This card deals 2 damage.)",
      )?.effects?.[0],
    ).toMatchObject({
      costs: [{ cost: "returnTrashToDeck", amount: 20 }],
      actions: expect.arrayContaining([{ action: "shuffleDeck", player: "self" }]),
    });
  });

  test("keeps Mjosgard's additional Character-rest payment", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] (1) (You may rest the specified number of DON!! cards in your cost area.) You may rest this Character and 1 of your Characters: Add up to 1 black Character card with a cost of 1 from your trash to your hand.",
      )?.effects?.[0]?.costs,
    ).toEqual(
      expect.arrayContaining([
        {
          cost: "restCards",
          amount: 1,
          filters: [{ filter: "excludeSelf" }, { filter: "cardCategory", value: "character" }],
        },
      ]),
    );
  });

  test("keeps Rebecca's name exclusion and inclusive recovery range", () => {
    expect(
      buildCardEffects(
        "[Blocker] [On Play] Add up to 1 black Character card with a cost of 3 to 7 other than [Rebecca] from your trash to your hand. Then, play up to 1 black Character card with a cost of 3 or less from your hand rested.",
      )?.effects?.[0]?.actions?.[0],
    ).toMatchObject({
      target: {
        filters: expect.arrayContaining([
          { filter: "excludeName", value: "Rebecca" },
          { filter: "cost", comparison: "gte", value: 3 },
          { filter: "cost", comparison: "lte", value: 7 },
        ]),
      },
    });
  });

  test("matches Rosward's Celestial Dragons trait inclusively", () => {
    expect(
      buildCardEffects(
        "[Your Turn] If the only Characters on your field are [Celestial Dragons] type Characters, give all of your opponent's Characters -6 cost.",
      )?.permanentEffects?.[0]?.conditions?.[1],
    ).toMatchObject({
      filters: [{ filter: "trait", value: "Celestial Dragons", match: "includes", negate: true }],
    });
  });
});
