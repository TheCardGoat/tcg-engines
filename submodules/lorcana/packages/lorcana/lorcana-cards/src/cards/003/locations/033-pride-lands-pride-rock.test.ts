import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { aladdinPrinceAli, arielOnHumanLegs, stitchNewDog } from "../../001";
import { prideLandsPrideRock } from "./033-pride-lands-pride-rock";

describe("Pride Lands - Pride Rock", () => {
  it("gives characters here +2 willpower", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [prideLandsPrideRock, aladdinPrinceAli, arielOnHumanLegs],
      inkwell: [stitchNewDog, stitchNewDog],
    });

    expect(testEngine.asPlayerOne().getCard(aladdinPrinceAli)?.willpower).toBe(
      aladdinPrinceAli.willpower,
    );
    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(aladdinPrinceAli, prideLandsPrideRock)
        .success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCard(aladdinPrinceAli)?.willpower).toBe(
      aladdinPrinceAli.willpower + 2,
    );
    expect(testEngine.asPlayerOne().getCard(arielOnHumanLegs)?.willpower).toBe(
      arielOnHumanLegs.willpower,
    );
  });

  it("lets you play a character for 1 less if you have a Prince here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [arielOnHumanLegs],
      play: [prideLandsPrideRock, aladdinPrinceAli],
      inkwell: [stitchNewDog, stitchNewDog, stitchNewDog, stitchNewDog, stitchNewDog],
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(aladdinPrinceAli, prideLandsPrideRock)
        .success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(testEngine.asPlayerOne().canPlayCard(arielOnHumanLegs)).toBe(true);
    expect(testEngine.asPlayerOne().playCard(arielOnHumanLegs)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("play");
  });

  it("does not reduce character costs without a Prince or King here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [arielOnHumanLegs],
      play: [prideLandsPrideRock, stitchNewDog],
      inkwell: [
        aladdinPrinceAli,
        aladdinPrinceAli,
        aladdinPrinceAli,
        aladdinPrinceAli,
        aladdinPrinceAli,
      ],
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(stitchNewDog, prideLandsPrideRock).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(testEngine.asPlayerOne().canPlayCard(arielOnHumanLegs)).toBe(false);
    expect(testEngine.asPlayerOne().playCard(arielOnHumanLegs).success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("hand");
  });
});
