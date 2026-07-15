import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { orvilleAlbatrossAir } from "./194-orville-albatross-air";

const missBiancaCharacter = createMockCharacter({
  id: "orville-test-miss-bianca",
  name: "Miss Bianca",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const bernardCharacter = createMockCharacter({
  id: "orville-test-bernard",
  name: "Bernard",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const nonRelatedCharacter = createMockCharacter({
  id: "orville-test-non-related",
  name: "Some Other Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Orville - Albatross Air", () => {
  it("should not have Evasive when no Miss Bianca or Bernard in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [orvilleAlbatrossAir, nonRelatedCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().hasKeyword(orvilleAlbatrossAir, "Evasive")).toBe(false);
  });

  it("should gain Evasive during your turn when Miss Bianca is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [orvilleAlbatrossAir, missBiancaCharacter],
      deck: 2,
    });

    // During player one's turn, Orville should have Evasive
    expect(testEngine.asPlayerOne().hasKeyword(orvilleAlbatrossAir, "Evasive")).toBe(true);

    // Pass turn - during opponent's turn, Orville should NOT have Evasive
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(orvilleAlbatrossAir, "Evasive")).toBe(false);

    // Pass turn back to player one - Orville should have Evasive again
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(orvilleAlbatrossAir, "Evasive")).toBe(true);
  });

  it("should gain Evasive during your turn when Bernard is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [orvilleAlbatrossAir, bernardCharacter],
      deck: 2,
    });

    // During player one's turn, Orville should have Evasive
    expect(testEngine.asPlayerOne().hasKeyword(orvilleAlbatrossAir, "Evasive")).toBe(true);

    // Pass turn - during opponent's turn, Orville should NOT have Evasive
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(orvilleAlbatrossAir, "Evasive")).toBe(false);

    // Pass turn back to player one - Orville should have Evasive again
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(orvilleAlbatrossAir, "Evasive")).toBe(true);
  });
});
