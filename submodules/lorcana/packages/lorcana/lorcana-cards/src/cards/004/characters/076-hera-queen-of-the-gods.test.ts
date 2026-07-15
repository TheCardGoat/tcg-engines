import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { heraQueenOfTheGods } from "./076-hera-queen-of-the-gods";

const zeusCharacter = createMockCharacter({
  id: "hera-zeus-char",
  name: "Zeus",
  version: "Test God",
  cost: 3,
  strength: 3,
  willpower: 4,
});

const herculesCharacter = createMockCharacter({
  id: "hera-hercules-char",
  name: "Hercules",
  version: "Test Hero",
  cost: 3,
  strength: 3,
  willpower: 3,
});

const otherCharacter = createMockCharacter({
  id: "hera-other-char",
  name: "Other Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Hera - Queen of the Gods", () => {
  it("has Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [heraQueenOfTheGods],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().hasKeyword(heraQueenOfTheGods, "Ward")).toBe(true);
  });

  it("PROTECTIVE GODDESS grants Ward to Zeus characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [heraQueenOfTheGods, zeusCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().hasKeyword(zeusCharacter, "Ward")).toBe(true);
  });

  it("YOU'RE A TRUE HERO grants Evasive to Hercules characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [heraQueenOfTheGods, herculesCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().hasKeyword(herculesCharacter, "Evasive")).toBe(true);
  });

  it("does not grant Ward or Evasive to non-Zeus/non-Hercules characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [heraQueenOfTheGods, otherCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Ward")).toBe(false);
    expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Evasive")).toBe(false);
  });
});
