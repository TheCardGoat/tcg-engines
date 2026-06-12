import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mullinsSeasonedShipmate } from "./177-mullins-seasoned-shipmate";
import { mrSmeeSteadfastMate } from "./175-mr-smee-steadfast-mate";

const nonSmeeCharacter = createMockCharacter({
  id: "mullins-test-non-smee",
  name: "Some Other Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const attackerCharacter = createMockCharacter({
  id: "mullins-test-attacker",
  name: "Attacker",
  cost: 3,
  strength: 4,
  willpower: 3,
});

describe("Mullins - Seasoned Shipmate", () => {
  it("does not have Resist without a Mr. Smee character in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mullinsSeasonedShipmate, nonSmeeCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().hasKeyword(mullinsSeasonedShipmate, "Resist")).toBe(false);
  });

  it("FALL IN LINE - gains Resist +1 while you have a character named Mr. Smee in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mullinsSeasonedShipmate, mrSmeeSteadfastMate],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().hasKeyword(mullinsSeasonedShipmate, "Resist")).toBe(true);
    expect(testEngine.getKeywordValue(mullinsSeasonedShipmate, "Resist")).toBe(1);
  });

  it("Resist reduces damage by 1 when challenged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: mullinsSeasonedShipmate, exerted: true }, mrSmeeSteadfastMate],
        deck: 2,
      },
      {
        play: [attackerCharacter],
        deck: 2,
      },
    );

    // Pass turn to player two so they can challenge
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().challenge(attackerCharacter, mullinsSeasonedShipmate),
    ).toBeSuccessfulCommand();

    // Attacker has 4 strength, Resist reduces by 1, so damage should be 3
    expect(testEngine.asPlayerOne().getDamage(mullinsSeasonedShipmate)).toBe(3);
  });
});
