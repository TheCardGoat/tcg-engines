import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { aladdinHeroicOutlaw, heiheiBoatSnack, magicBroomBucketBrigade } from "../characters";
import { ransack } from "./199-ransack";
import { youHaveForgottenMe } from "./031-you-have-forgotten-me";
import { heiheiBumblingRooster } from "../../004";

describe("Ransack", () => {
  it("draws 2 cards, then chooses and discards 2 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: ransack.cost,
      hand: [ransack, aladdinHeroicOutlaw],
      deck: [heiheiBoatSnack, heiheiBumblingRooster, magicBroomBucketBrigade, youHaveForgottenMe],
    });

    // Ransack needs to be resolved in two steps, so the active player is able to see what cards they're drawing.
    const playResult = testEngine.asPlayerOne().playCard(ransack);
    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 3, deck: 2, discard: 0 }),
    );
    expect(testEngine.asPlayerOne().getCardZone(ransack)).toEqual("limbo");
    expect(testEngine.asPlayerOne().getCardZone(aladdinHeroicOutlaw)).toEqual("hand");
    expect(testEngine.asPlayerOne().getCardZone(youHaveForgottenMe)).toEqual("hand");
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
    expect(testEngine.asPlayerOne().getPendingEffects()[0]).toEqual(
      expect.objectContaining({
        type: "discard-choice",
        source: "game",
      }),
    );
    expect(testEngine.asPlayerOne().getPendingChoice()).toEqual(
      expect.objectContaining({
        type: "action-effect",
        playerID: "player_one",
      }),
    );
    expect(testEngine.asServer().getState().G.pendingEffects).toEqual([
      expect.objectContaining({
        kind: "discard-choice",
        chooserId: "player_one",
        controllerId: "player_one",
      }),
    ]);
    expect(testEngine.asServer().getState().ctx.priority.pendingChoice).toEqual(
      expect.objectContaining({ playerID: "player_one" }),
    );
  });
});
