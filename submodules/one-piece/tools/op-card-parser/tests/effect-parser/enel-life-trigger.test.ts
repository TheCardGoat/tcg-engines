import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

test("Enel captures Life becoming zero at the triggering removal", () => {
  const result = buildCardEffects(
    "[Opponent's Turn][Once Per Turn] When your number of Life cards becomes 0, add 1 card from the top of your deck to the top of your Life cards. Then, trash 1 card from your hand.",
  );
  expect(result?.effects?.[0]).toMatchObject({
    trigger: "whenLifeRemoved",
    eventFilter: { player: "self", lifeCountAfterRemoval: 0 },
    conditions: [{ condition: "turn", value: "opponent" }],
    oncePerTurn: true,
    actions: [{ action: "addToLife" }, { action: "trashFromHand", amount: 1 }],
  });
  expect(result?.effects?.[0]?.conditions).toEqual([{ condition: "turn", value: "opponent" }]);
});

test("an ordinary Life-count If remains a resolution condition", () => {
  const result = buildCardEffects("[On Play] If you have 0 Life cards, draw 1 card.");
  expect(result?.effects?.[0]).toMatchObject({
    trigger: "onPlay",
    conditions: [{ condition: "lifeCount", player: "self", comparison: "eq", value: 0 }],
  });
  expect(result?.effects?.[0]?.eventFilter).toBeUndefined();
});
