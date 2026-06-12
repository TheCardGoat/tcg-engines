import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { genieOfTheLamp } from "./076-genie-of-the-lamp";

const alliedCharacter = createMockCharacter({
  id: "genie-of-the-lamp-allied-character",
  name: "Allied Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Genie - Of the Lamp", () => {
  it("gives your other characters +2 strength while Genie is exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: genieOfTheLamp, exerted: true }, alliedCharacter],
    });

    expect(testEngine.asPlayerOne().getCardStrength(alliedCharacter)).toBe(
      alliedCharacter.strength + 2,
    );
    expect(testEngine.asPlayerOne().getCardStrength(genieOfTheLamp)).toBe(genieOfTheLamp.strength);
  });

  it("does not buff your other characters while Genie is ready", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [genieOfTheLamp, alliedCharacter],
    });

    expect(testEngine.asPlayerOne().getCardStrength(alliedCharacter)).toBe(
      alliedCharacter.strength,
    );
  });
});
