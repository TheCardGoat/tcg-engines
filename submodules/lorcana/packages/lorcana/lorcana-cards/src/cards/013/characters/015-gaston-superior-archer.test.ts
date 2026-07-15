import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { gastonSuperiorArcher } from "./015-gaston-superior-archer";

const strongCharacter = createMockCharacter({
  id: "gaston-superior-archer-strong-character",
  name: "Strong Character",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 1,
});

const weakCharacter = createMockCharacter({
  id: "gaston-superior-archer-weak-character",
  name: "Weak Character",
  cost: 2,
  strength: 4,
  willpower: 4,
  lore: 1,
});

describe("Gaston - Superior Archer", () => {
  it("may banish a chosen character with 5 strength or more", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [gastonSuperiorArcher],
      inkwell: gastonSuperiorArcher.cost,
      play: [strongCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(gastonSuperiorArcher)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(gastonSuperiorArcher, {
        resolveOptional: true,
        targets: [strongCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(strongCharacter)).toBe("discard");
  });

  it("cannot target a character with less than 5 strength", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [gastonSuperiorArcher],
      inkwell: gastonSuperiorArcher.cost,
      play: [weakCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(gastonSuperiorArcher)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(gastonSuperiorArcher, {
        resolveOptional: true,
        targets: [weakCharacter],
      }),
    ).not.toBeSuccessfulCommand();
  });
});
