import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { galacticCommunicator } from "./099-galactic-communicator";

const weakTarget = createMockCharacter({
  id: "galactic-communicator-weak-target",
  name: "Weak Target",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Galactic Communicator", () => {
  it("returns a chosen character with 2 strength or less to their player's hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        inkwell: 1,
        play: [galacticCommunicator],
      },
      {
        deck: 2,
        play: [weakTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(galacticCommunicator, {
        targets: [weakTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(galacticCommunicator)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(weakTarget)).toBe("hand");
  });
});
