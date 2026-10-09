import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";
test("Teach shares the Character duration without changing the earlier Leader duration", () => {
  const result = buildCardEffects(
    "[Activate: Main] [Once Per Turn] If your Leader has the {Blackbeard Pirates} type and this Character was played on this turn, negate the effect of up to 1 of your opponent's Leader during this turn. Then, negate the effect of up to 1 of your opponent's Characters and that Character cannot attack until the end of your opponent's next turn.",
  );
  expect(result?.effects?.[0]?.actions).toMatchObject([
    { action: "negateEffects", duration: "thisTurn" },
    { action: "negateEffects", duration: "untilEndOfOpponentNextTurn" },
    { action: "cannotAttack", duration: "untilEndOfOpponentNextTurn", previousActionTargets: true },
  ]);
});

test("Kuzan's colon separates opposing Character-to-Life payment from the discard effect", () => {
  const result = buildCardEffects(
    "[On Play] Place 1 of your opponent's Characters with a cost of 3 or less at the top or bottom of your opponent's Life cards face-up: Your opponent trashes 1 card from their hand.",
  );
  expect(result?.effects?.[0]).toMatchObject({
    trigger: "onPlay",
    costs: [
      {
        cost: "addCharacterToLife",
        player: "opponent",
        amount: 1,
        position: "choice",
        faceUp: true,
        filters: [{ filter: "cost", comparison: "lte", value: 3 }],
      },
    ],
    actions: [{ action: "trashFromHand", player: "opponent", amount: 1 }],
  });
  expect(result?.effects?.[0]?.actions).toHaveLength(1);
  expect(result?.effects?.[0]?.optional).not.toBe(true);
});
