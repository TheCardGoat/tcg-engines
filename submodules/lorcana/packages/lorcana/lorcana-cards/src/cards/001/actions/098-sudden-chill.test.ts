import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { aladdinHeroicOutlaw, magicBroomBucketBrigade } from "../characters";
import { suddenChill } from "./098-sudden-chill";

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

    const playResult = testEngine.asPlayerOne().playCard(suddenChill);
    expect(playResult).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 2, discard: 0 });
    expect(testEngine.asServer().getState().G.pendingEffects).toEqual([
      expect.objectContaining({
        kind: "discard-choice",
        chooserId: "player_two",
        controllerId: "player_one",
      }),
    ]);
    expect(testEngine.asServer().getState().ctx.priority.pendingChoice).toEqual(
      expect.objectContaining({ playerID: "player_two" }),
    );
    expect(testEngine.asPlayerTwo().getCardZone(magicBroomBucketBrigade)).toEqual("hand");
    expect(testEngine.asPlayerTwo().getCardZone(aladdinHeroicOutlaw)).toEqual("hand");
  });

  it("resolves successfully when the opponent has no cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [suddenChill],
      inkwell: suddenChill.cost,
    });

    expect(testEngine.asPlayerOne().playCard(suddenChill)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 0, discard: 0 });
    expect(testEngine.asPlayerOne().getCardZone(suddenChill)).toEqual("discard");
  });
});
