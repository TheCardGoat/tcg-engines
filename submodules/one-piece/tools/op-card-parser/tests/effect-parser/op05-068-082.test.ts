import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

describe("OP05-068 through OP05-082 Character parser regressions", () => {
  test("preserves inclusive trait matching on Chopa-Emon, Law, and Mr.1", () => {
    for (const text of [
      "[On Play] If you have 8 or more DON!! cards on your field, set up to 1 of your purple [Straw Hat Crew] type Characters with 6000 power or less as active.",
      "[When Attacking] If your opponent has more DON!! cards on their field than you, look at 5 cards from the top of your deck; reveal up to 1 [Heart Pirates] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
      "[On Your Opponent's Attack][Once Per Turn] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play up to 1 [Baroque Works] type Character card with a cost of 3 or less from your hand.",
    ]) {
      expect(JSON.stringify(buildCardEffects(text))).toContain('"match":"includes"');
    }
  });

  test("parses Miss Doublefinger's optional physical-card Trigger", () => {
    const result = buildCardEffects(
      "[On Play] You may trash 1 card from your hand: Add up to 1 DON!! card from your DON!! deck and rest it. [Trigger] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play this card.",
    );
    expect(result?.effects?.[1]).toEqual({
      trigger: "trigger",
      costs: [{ cost: "returnDon", amount: 1 }],
      actions: [{ action: "playThisCard" }],
    });
  });

  test("keeps Shirahoshi's trash return as a cost and hand gate on the action", () => {
    const result = buildCardEffects(
      "[Activate:Main] You may rest this Character and place 2 cards from your trash at the bottom of your deck in any order: If your opponent has 6 or more cards in their hand, your opponent trashes 1 card from their hand.",
    );
    expect(result?.effects?.[0]).toMatchObject({
      costs: [
        { cost: "restThisCard" },
        { cost: "returnTrashToDeck", amount: 2, position: "bottom" },
      ],
      actions: [
        {
          action: "trashFromHand",
          condition: { condition: "handCount", player: "opponent", comparison: "gte", value: 6 },
        },
      ],
    });
  });
});
