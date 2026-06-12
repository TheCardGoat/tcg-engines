import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { galacticCouncilChamberCourtroom } from "./204-galactic-council-chamber-courtroom";

const alienResident = createMockCharacter({
  id: "galactic-council-alien",
  name: "Alien Resident",
  cost: 2,
  classifications: ["Storyborn", "Alien"],
});

const attacker = createMockCharacter({
  id: "galactic-council-attacker",
  name: "Attacker",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Galactic Council Chamber - Courtroom", () => {
  it("cannot be challenged while you have an Alien or Robot character here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [galacticCouncilChamberCourtroom, alienResident],
        inkwell: galacticCouncilChamberCourtroom.moveCost,
      },
      {
        play: [attacker],
      },
    );

    expect(
      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(alienResident, galacticCouncilChamberCourtroom).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().canChallenge(attacker, galacticCouncilChamberCourtroom)).toBe(
      false,
    );
  });
});
