import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { stitchHighBadnessLevel } from "./185-stitch-high-badness-level";

const nonLiloCharacter = createMockCharacter({
  id: "stitch-non-lilo-char",
  name: "Not Lilo",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const liloCharacter = createMockCharacter({
  id: "stitch-lilo-char",
  name: "Lilo",
  cost: 3,
  strength: 1,
  willpower: 3,
});

describe("Stitch - High Badness Level", () => {
  it("does not have Challenger without a Lilo character in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [stitchHighBadnessLevel, nonLiloCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().hasKeyword(stitchHighBadnessLevel, "Challenger")).toBe(false);
  });

  it("AMPED UP - gains Challenger +3 while you have a character named Lilo in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [stitchHighBadnessLevel, liloCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().hasKeyword(stitchHighBadnessLevel, "Challenger")).toBe(true);
    expect(testEngine.getKeywordValue(stitchHighBadnessLevel, "Challenger")).toBe(3);
  });
});
