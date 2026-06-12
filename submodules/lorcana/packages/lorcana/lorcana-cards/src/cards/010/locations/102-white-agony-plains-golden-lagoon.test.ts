import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { whiteAgonyPlainsGoldenLagoon } from "./102-white-agony-plains-golden-lagoon";

const lagoonGuest = createMockCharacter({
  id: "lagoon-guest",
  name: "Lagoon Guest",
  cost: 2,
});

describe("White Agony Plains - Golden Lagoon", () => {
  it("gets +1 lore for each character here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [whiteAgonyPlainsGoldenLagoon, lagoonGuest],
      inkwell: whiteAgonyPlainsGoldenLagoon.moveCost,
    });

    expect(testEngine.asPlayerOne().getCard(whiteAgonyPlainsGoldenLagoon).lore).toBe(0);
    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(lagoonGuest, whiteAgonyPlainsGoldenLagoon)
        .success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getCard(whiteAgonyPlainsGoldenLagoon).lore).toBe(1);
  });
});
