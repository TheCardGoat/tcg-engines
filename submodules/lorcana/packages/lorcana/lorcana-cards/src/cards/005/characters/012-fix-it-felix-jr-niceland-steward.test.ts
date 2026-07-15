import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { fixitFelixJrNicelandSteward } from "./012-fix-it-felix-jr-niceland-steward";
import { theLibraryAGiftForBelle } from "../locations/068-the-library-a-gift-for-belle";

describe("Fix-It Felix, Jr. - Niceland Steward", () => {
  it("BUILDING TOGETHER: your locations get +2 willpower while this card is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [fixitFelixJrNicelandSteward, theLibraryAGiftForBelle],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCard(theLibraryAGiftForBelle)?.willpower).toBe(
      theLibraryAGiftForBelle.willpower + 2,
    );
  });

  it("BUILDING TOGETHER: does not buff opponent locations", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [fixitFelixJrNicelandSteward],
        deck: 1,
      },
      {
        play: [theLibraryAGiftForBelle],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerTwo().getCard(theLibraryAGiftForBelle)?.willpower).toBe(
      theLibraryAGiftForBelle.willpower,
    );
  });
});
