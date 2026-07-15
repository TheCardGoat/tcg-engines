import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theLibraryAGiftForBelle } from "./068-the-library-a-gift-for-belle";

const libraryResident = createMockCharacter({
  id: "library-resident",
  name: "Library Resident",
  cost: 2,
  strength: 1,
  willpower: 1,
});

const invadingAttacker = createMockCharacter({
  id: "library-attacker",
  name: "Invading Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
});

const drawCard = createMockCharacter({ id: "library-draw", name: "Library Draw", cost: 1 });

describe("The Library - A Gift for Belle", () => {
  it("lets you draw a card when a character is banished while here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          theLibraryAGiftForBelle,
          { card: libraryResident, atLocation: theLibraryAGiftForBelle, exerted: true },
        ],
        deck: [drawCard],
      },
      {
        play: [invadingAttacker],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().challenge(invadingAttacker, libraryResident).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().resolvePendingByCard(theLibraryAGiftForBelle).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne().getCardZone(libraryResident)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(drawCard)).toBe("hand");
  });
});
