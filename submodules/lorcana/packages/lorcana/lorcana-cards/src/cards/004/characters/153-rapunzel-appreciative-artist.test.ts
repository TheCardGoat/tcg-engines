import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rapunzelAppreciativeArtist } from "./153-rapunzel-appreciative-artist";

const pascalCharacter = createMockCharacter({
  id: "rapunzel-appreciative-artist-test-pascal",
  name: "Pascal",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const nonRelatedCharacter = createMockCharacter({
  id: "rapunzel-appreciative-artist-test-non-related",
  name: "Some Other Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Rapunzel - Appreciative Artist", () => {
  it("should not have Ward without Pascal in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rapunzelAppreciativeArtist, nonRelatedCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().hasKeyword(rapunzelAppreciativeArtist, "Ward")).toBe(false);
  });

  it("PERCEPTIVE PARTNER should gain Ward while Pascal is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rapunzelAppreciativeArtist, pascalCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().hasKeyword(rapunzelAppreciativeArtist, "Ward")).toBe(true);
  });
});
