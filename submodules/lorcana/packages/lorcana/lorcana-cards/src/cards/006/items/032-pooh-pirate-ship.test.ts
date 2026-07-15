import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { poohPirateShip } from "./032-pooh-pirate-ship";

const rescuedPirate = createMockCharacter({
  id: "pooh-pirate-ship-rescued-pirate",
  name: "Rescued Pirate",
  cost: 2,
  classifications: ["Storyborn", "Pirate"],
});

const strandedAlly = createMockCharacter({
  id: "pooh-pirate-ship-stranded-ally",
  name: "Stranded Ally",
  cost: 2,
});

describe("Pooh Pirate Ship", () => {
  it("rejects a non-Pirate as a return target (single-object typed has-classification filter)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: 2,
      discard: [rescuedPirate, strandedAlly],
      inkwell: 3,
      play: [poohPirateShip],
    });

    // Attempt to return the non-Pirate. The single-object typed
    // has-classification filter must exclude it.
    testEngine.asPlayerOne().activateAbility(poohPirateShip, {
      targets: [strandedAlly],
    });

    expect(testEngine.asPlayerOne().getCardZone(strandedAlly)).toBe("discard");
  });

  it("returns a Pirate character card from your discard to your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: 2,
      discard: [rescuedPirate, strandedAlly],
      inkwell: 3,
      play: [poohPirateShip],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(poohPirateShip, {
        targets: [rescuedPirate],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(rescuedPirate)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(strandedAlly)).toBe("discard");
  });
});
