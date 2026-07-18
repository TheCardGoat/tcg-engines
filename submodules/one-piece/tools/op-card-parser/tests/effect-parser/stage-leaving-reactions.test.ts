import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

describe("Stage leave-field reactions", () => {
  test("preserves Moby Dick's controller, inclusive trait, cause, and ordered actions", () => {
    expect(
      buildCardEffects(
        '[Your Turn] [Once Per Turn] When your Character with a type including "Whitebeard Pirates" is removed from the field by an effect, draw 1 card. Then, place 1 card from your hand at the top or bottom of your deck. [Trigger] Play this card.',
      )?.effects?.[0],
    ).toMatchObject({
      trigger: "whenLeaving",
      eventFilter: {
        player: "self",
        causedBy: "any",
        filters: [{ filter: "trait", value: "Whitebeard Pirates", match: "includes" }],
      },
      conditions: [{ condition: "turn", value: "your" }],
      actions: [
        { action: "draw", player: "self", amount: 1 },
        { action: "returnToDeck", position: "any" },
      ],
      oncePerTurn: true,
    });
  });

  test("preserves Thousand Sunny's opponent-caused controller-owned trait filter", () => {
    expect(
      buildCardEffects(
        "[Opponent's Turn] You may rest this Stage: When your \"Straw Hat Crew\" type Character is removed from the field by your opponent's effect, add up to 1 DON!! card from your DON!! deck and rest it.",
      )?.effects?.[0],
    ).toMatchObject({
      trigger: "whenLeaving",
      eventFilter: {
        player: "self",
        causedBy: "opponent",
        filters: [{ filter: "trait", value: "Straw Hat Crew", match: "includes" }],
      },
      conditions: [{ condition: "turn", value: "opponent" }],
      costs: [{ cost: "restThisCard" }],
      optional: true,
    });
  });
});
