import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { hadesLordOfTheUnderworld } from "./006-hades-lord-of-the-underworld";

const returnedCharacter = createMockCharacter({
  id: "hades-lord-of-the-underworld-returned-character",
  name: "Returned Character",
  cost: 2,
  lore: 1,
});

const otherCharacter = createMockCharacter({
  id: "hades-lord-of-the-underworld-other-character",
  name: "Other Character",
  cost: 3,
  lore: 1,
});

describe("Hades - Lord of the Underworld", () => {
  it("WELL OF SOULS - returns a chosen character card from your discard to your hand when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hadesLordOfTheUnderworld],
      discard: [{ card: returnedCharacter }, { card: otherCharacter }],
      inkwell: hadesLordOfTheUnderworld.cost,
    });

    expect(testEngine.asPlayerOne().playCard(hadesLordOfTheUnderworld)).toBeSuccessfulCommand();

    // The bag is auto-resolved but suspends waiting for target selection
    expect(testEngine.asPlayerOne().getPendingChoice()).toBeDefined();

    const returnedCharacterId = testEngine.findCardInstanceId(returnedCharacter, "discard");
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [returnedCharacterId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(returnedCharacter)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(otherCharacter)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(hadesLordOfTheUnderworld)).toBe("play");
  });
});
