import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { dinglehopper } from "../../001/items";
import { dragonFire, simbaProtectiveCub } from "../../001";
import { theLibraryAGiftForBelle } from "../locations/068-the-library-a-gift-for-belle";
import { peteGamesReferee } from "./195-pete-games-referee";

describe("Pete - Games Referee", () => {
  it("stops opponents from playing actions until your next turn starts", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [peteGamesReferee],
        inkwell: peteGamesReferee.cost,
        deck: [peteGamesReferee, peteGamesReferee],
      },
      {
        hand: [dragonFire, dinglehopper, theLibraryAGiftForBelle, simbaProtectiveCub],
        deck: [dragonFire, dinglehopper],
        inkwell: 10,
      },
    );

    expect(testEngine.asPlayerOne().playCard(peteGamesReferee)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasPlayerRestriction(PLAYER_TWO, "cant-play-actions")).toBe(
      true,
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().canPlayCard(dragonFire)).toBe(false);
    expect(testEngine.asPlayerTwo().playCard(dragonFire).success).toBe(false);
    expect(testEngine.asPlayerTwo().playCard(dinglehopper)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().playCard(theLibraryAGiftForBelle)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().playCard(simbaProtectiveCub)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().canPlayCard(dragonFire)).toBe(true);
    expect(
      testEngine.asPlayerTwo().playCard(dragonFire, { targets: [simbaProtectiveCub] }),
    ).toBeSuccessfulCommand();
  });
});
