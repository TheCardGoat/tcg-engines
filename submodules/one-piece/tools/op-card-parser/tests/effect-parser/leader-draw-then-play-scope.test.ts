import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/index.ts";

describe("Leader conditions before draw and direct play", () => {
  test("EB03-003 gates both actions on Uta, as required by official FAQ Q1072", () => {
    const result = buildCardEffects(
      "[On Play] If your Leader is [Uta], draw 2 cards. Then, play up to 1 Character card with 6000 power or less and no base effect from your hand.",
    );
    expect(result?.effects).toHaveLength(1);
    expect(result?.effects?.[0]).toMatchObject({
      trigger: "onPlay",
      conditions: [{ condition: "leaderName", name: "Uta" }],
      actions: [{ action: "draw", amount: 2 }, { action: "play" }],
    });
    expect(result?.effects?.[0]?.actions[0]).not.toHaveProperty("condition");
    expect(result?.effects?.[0]?.actions[1]).toMatchObject({
      source: { player: "self", zone: "hand" },
      filters: expect.arrayContaining([
        { filter: "noBaseEffect" },
        { filter: "power", comparison: "lte", value: 6000 },
      ]),
    });
  });

  test("EB03-039 retains its Leader trait gate over draw, trash, and play (FAQ Q1085)", () => {
    const block = buildCardEffects(
      "[On Play] If your Leader has the {Animal Kingdom Pirates} type, draw 1 card and trash 1 card from your hand. Then, play up to 1 Character card with 6000 power or less and no base effect from your trash.",
    )?.effects?.[0];
    expect(block?.conditions).toEqual([
      { condition: "leaderTrait", trait: "Animal Kingdom Pirates", match: "exact" },
    ]);
    expect(block?.actions.map((action) => action.action)).toEqual([
      "draw",
      "trashFromHand",
      "play",
    ]);
    expect(block?.actions[2]).toMatchObject({ source: { player: "self", zone: "trash" } });
  });

  test("OP07-107 keeps the leading draw independent of the later Life condition", () => {
    const block = buildCardEffects(
      "[Trigger] Draw 1 card. Then, if you have 1 or less Life cards, play this card.",
    )?.effects?.[0];
    expect(block?.conditions).toBeUndefined();
    expect(block?.actions[0]).toEqual({ action: "draw", player: "self", amount: 1 });
    expect(block?.actions[1]).toMatchObject({
      action: "playThisCard",
      condition: { condition: "lifeCount", player: "self", comparison: "lte", value: 1 },
    });
  });
});
