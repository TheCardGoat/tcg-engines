import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

describe("OP10-118, OP10-119, and OP11-004 shared parser regressions", () => {
  test("OP10-118 preserves once-per-turn opponent-effect K.O. prevention and ordered trash cost", () => {
    const result = buildCardEffects(
      "Once per turn, this Character cannot be K.O.'d by your opponent's effects.\n[When Attacking] You may place 3 cards from your trash at the bottom of your deck in any order: If your opponent has 5 or more cards in their hand, your opponent trashes 1 card from their hand.",
    );

    expect(result?.replacementEffects).toEqual([
      {
        replacedEvent: "ko",
        source: "opponentEffect",
        eventFilter: { targetSelf: true },
        replacementAction: { action: "sequence", actions: [] },
        oncePerTurn: true,
        mandatory: true,
      },
    ]);
    expect(result?.effects?.[0]).toMatchObject({
      trigger: "whenAttacking",
      costs: [{ cost: "returnTrashToDeck", amount: 3, position: "bottom" }],
    });
  });

  test("OP10-119 reveals and moves the same physical Supernovas Character before giving DON", () => {
    const result = buildCardEffects(
      '[On Play] Reveal up to 1 "Supernovas" type Character card from your hand and add it to the top of your Life cards face-down. Then, give up to 1 rested DON!! card to 1 of your "Supernovas" type Leader.',
    );

    expect(result?.effects?.[0]?.actions).toMatchObject([
      {
        action: "revealFromHand",
        player: "self",
        amount: 1,
        upTo: true,
        filters: [
          { filter: "trait", value: "Supernovas", match: "includes" },
          { filter: "cardCategory", value: "character" },
        ],
        thenActions: [
          {
            action: "addToLife",
            position: "top",
            previousActionTargets: true,
          },
        ],
      },
      { action: "giveDon", donState: "rested" },
    ]);
  });

  test("OP11-004 recognizes a quoted excluded name after a quoted trait", () => {
    const result = buildCardEffects(
      '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 "Navy" type card other than "Kujyaku" and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
    );

    expect(result?.effects?.[0]?.actions[0]).toMatchObject({
      action: "search",
      revealFilters: [
        { filter: "excludeName", value: "Kujyaku" },
        { filter: "trait", value: "Navy", match: "includes" },
      ],
    });
  });
});
