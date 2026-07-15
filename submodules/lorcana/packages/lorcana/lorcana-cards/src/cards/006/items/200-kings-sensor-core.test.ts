import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { kingsSensorCore } from "./200-kings-sensor-core";

const princeGuard = createMockCharacter({
  id: "kings-sensor-core-prince-guard",
  name: "Prince Guard",
  cost: 2,
  classifications: ["Storyborn", "Prince"],
  strength: 2,
  willpower: 3,
});

const kingGuard = createMockCharacter({
  id: "kings-sensor-core-king-guard",
  name: "King Guard",
  cost: 2,
  classifications: ["Storyborn", "King"],
  strength: 2,
  willpower: 3,
});

const outsider = createMockCharacter({
  id: "kings-sensor-core-outsider",
  name: "Outsider",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
  strength: 2,
  willpower: 3,
});

const revealedPrince = createMockCharacter({
  id: "kings-sensor-core-revealed-prince",
  name: "Revealed Prince",
  cost: 2,
  classifications: ["Storyborn", "Prince"],
});

describe("King's Sensor Core", () => {
  it("gives your Prince and King characters Resist +1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [kingsSensorCore, princeGuard, kingGuard, outsider],
    });

    expect(testEngine.asPlayerOne().hasKeyword(princeGuard, "Resist")).toBe(true);
    expect(testEngine.asPlayerOne().hasKeyword(kingGuard, "Resist")).toBe(true);
    expect(testEngine.asPlayerOne().hasKeyword(outsider, "Resist")).toBe(false);
  });

  it("may put a revealed Prince or King character card into your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [revealedPrince],
      inkwell: 2,
      play: [kingsSensorCore],
    });

    expect(testEngine.asPlayerOne().activateAbility(kingsSensorCore)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [{ zone: "hand", cards: [revealedPrince] }],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(revealedPrince)).toBe("hand");
  });
});
