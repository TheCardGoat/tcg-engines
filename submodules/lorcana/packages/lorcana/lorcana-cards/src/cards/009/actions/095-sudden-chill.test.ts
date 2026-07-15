import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { aladdinHeroicOutlaw, magicBroomBucketBrigade } from "../../001";
import { suddenChill } from "./095-sudden-chill";

describe("Sudden Chill", () => {
  it("makes each opponent choose and discard a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [suddenChill],
        inkwell: suddenChill.cost,
      },
      {
        hand: [magicBroomBucketBrigade, aladdinHeroicOutlaw],
      },
    );
    const discardId = testEngine.findCardInstanceId(aladdinHeroicOutlaw, "hand", "p2");

    expect(testEngine.asPlayerOne().playCard(suddenChill)).toBeSuccessfulCommand();
    const effectId = testEngine.asServer().getState().ctx.priority.pendingChoice?.requestID;
    expect(
      effectId
        ? testEngine.asPlayerTwo().resolveEffect(effectId, { targets: [discardId] }).success
        : false,
    ).toBe(true);

    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 1, discard: 1 });
    expect(testEngine.asPlayerTwo().getCardZone(aladdinHeroicOutlaw)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(0);
  });
});
