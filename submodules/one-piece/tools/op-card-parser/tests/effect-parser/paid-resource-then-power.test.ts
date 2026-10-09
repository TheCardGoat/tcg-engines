import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/index.ts";

describe("paid resource clauses and shared qualifiers", () => {
  test("Enel's Life gate covers Life and power after hand payment (FAQ Q879)", () => {
    const block = buildCardEffects(
      "[When Attacking] You may trash 1 card from your hand: If you have 1 or less Life cards, add up to 1 card from the top of your deck to the top of your Life cards. Then, this Character gains +1000 power during this turn.",
    )?.effects?.[0];
    expect(block?.conditions).toBeUndefined();
    expect(block?.costs).toEqual([{ cost: "trashFromHand", amount: 1 }]);
    expect(block?.optional).toBe(true);
    expect(block?.actions).toEqual([
      expect.objectContaining({
        action: "conditional",
        predicate: { condition: "lifeCount", player: "self", comparison: "lte", value: 1 },
        whenTrue: [
          expect.objectContaining({ action: "addToLife" }),
          expect.objectContaining({ action: "modifyPower", value: 1000 }),
        ],
      }),
    ]);
  });

  test("only-type field gate covers DON and power after return payment (FAQ Q860)", () => {
    const block = buildCardEffects(
      '[Activate: Main] [Once Per Turn] DON!! -2: If the only Characters on your field are "Straw Hat Crew" type Characters, set up to 2 of your DON!! cards as active. Then, this Leader gains +1000 power until the end of your opponent\'s next turn.',
    )?.effects?.[0];
    expect(block?.conditions).toBeUndefined();
    expect(block?.costs).toEqual([{ cost: "returnDon", amount: 2 }]);
    expect(block?.oncePerTurn).toBe(true);
    expect(block?.actions).toEqual([
      expect.objectContaining({
        action: "conditional",
        predicate: {
          condition: "compound",
          operator: "and",
          conditions: [
            {
              condition: "zoneCount",
              player: "self",
              zone: "character",
              comparison: "gte",
              value: 1,
            },
            {
              condition: "zoneCount",
              player: "self",
              zone: "character",
              comparison: "eq",
              value: 0,
              filters: [{ filter: "trait", value: "Straw Hat Crew", match: "exact", negate: true }],
            },
          ],
        },
        whenTrue: [
          expect.objectContaining({ action: "setActive" }),
          expect.objectContaining({
            action: "modifyPower",
            duration: "untilEndOfOpponentNextTurn",
          }),
        ],
      }),
    ]);
  });

  test.each(["active", "rested"])(
    "preserves explicit %s DON return state and both following actions",
    (donState) => {
      const block = buildCardEffects(
        `[When Attacking] [Once Per Turn] You may return 2 of your ${donState} DON!! cards to your DON!! deck: Set this Character as active. Then, add 1 card from the top of your Life cards to your hand.`,
      )?.effects?.[0];
      expect(block?.costs).toEqual([{ cost: "returnDon", amount: 2, donState }]);
      expect(block?.optional).toBe(true);
      expect(block?.oncePerTurn).toBe(true);
      expect(block?.actions.map((action) => action.action)).toEqual([
        "setActive",
        "removeFromLife",
      ]);
    },
  );

  test("shares yellow and cost across trait/name alternatives while preserving the later Life gate (FAQ Q881)", () => {
    const block = buildCardEffects(
      '[Counter] Up to 1 of your Leader or Character cards gains +1000 power during this battle. Then, if you have 1 or less Life cards, play up to 1 of your yellow "Straw Hat Crew" type Character cards or [Sanji] with a cost of 5 or less from your hand.',
    )?.effects?.[0];
    expect(block?.conditions).toBeUndefined();
    expect(block?.actions[0]).not.toHaveProperty("condition");
    expect(block?.actions[1]).toMatchObject({
      action: "play",
      condition: { condition: "lifeCount", player: "self", comparison: "lte", value: 1 },
      filters: [
        { filter: "cost", comparison: "lte", value: 5 },
        { filter: "cardCategory", value: "character" },
        { filter: "color", value: "yellow" },
        {
          filter: "anyOf",
          groups: [
            [{ filter: "trait", value: "Straw Hat Crew", match: "exact" }],
            [{ filter: "name", value: "Sanji" }],
          ],
        },
      ],
    });
  });
});
