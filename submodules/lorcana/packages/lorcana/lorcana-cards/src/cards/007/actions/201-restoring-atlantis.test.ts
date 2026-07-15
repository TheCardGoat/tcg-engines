import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { anastasiaBossyStepsister, elsaTrustedSister, mufasaRespectedKing } from "../../007";
import { restoringAtlantis } from "./201-restoring-atlantis";

describe("Restoring Atlantis", () => {
  it("prevents your characters from being challenged until your next turn starts", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [restoringAtlantis],
        inkwell: restoringAtlantis.cost,
        deck: [anastasiaBossyStepsister, elsaTrustedSister],
        play: [anastasiaBossyStepsister, elsaTrustedSister],
      },
      {
        deck: [mufasaRespectedKing, mufasaRespectedKing],
        play: [mufasaRespectedKing],
      },
    );

    expect(testEngine.asPlayerOne().playCard(restoringAtlantis)).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualExertCard(anastasiaBossyStepsister)).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualExertCard(elsaTrustedSister)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().canChallenge(mufasaRespectedKing, anastasiaBossyStepsister),
    ).toBe(false);
    expect(testEngine.asPlayerTwo().canChallenge(mufasaRespectedKing, elsaTrustedSister)).toBe(
      false,
    );

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualExertCard(anastasiaBossyStepsister)).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualExertCard(elsaTrustedSister)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().canChallenge(mufasaRespectedKing, anastasiaBossyStepsister),
    ).toBe(true);
  });
});
