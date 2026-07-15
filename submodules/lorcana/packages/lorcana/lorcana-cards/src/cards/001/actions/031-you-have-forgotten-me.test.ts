import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  aladdinHeroicOutlaw,
  heiheiBoatSnack,
  magicBroomBucketBrigade,
  mickeyMouseTrueFriend,
} from "../characters";
import { youHaveForgottenMe } from "./031-you-have-forgotten-me";

describe("You Have Forgotten Me", () => {
  it("makes each opponent choose and discard 2 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [youHaveForgottenMe],
        inkwell: youHaveForgottenMe.cost,
      },
      {
        hand: [
          magicBroomBucketBrigade,
          aladdinHeroicOutlaw,
          heiheiBoatSnack,
          mickeyMouseTrueFriend,
        ],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(youHaveForgottenMe);
    expect(playResult).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 4, discard: 0 });
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
    expect(testEngine.asPlayerTwo().getCardZone(heiheiBoatSnack)).toEqual("hand");
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toEqual("hand");
  });
});
