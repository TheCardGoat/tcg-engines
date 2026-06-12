import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { honkerMuddlefootTimidGenius } from "./143-honker-muddlefoot-timid-genius";

const nonDarkwingCharacter = createMockCharacter({
  id: "honker-non-dw-char",
  name: "Non Darkwing Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const darkwingDuckCharacter = createMockCharacter({
  id: "honker-dw-char",
  name: "Darkwing Duck",
  version: "Test Hero",
  cost: 3,
  strength: 3,
  willpower: 3,
});

describe("Honker Muddlefoot - Timid Genius", () => {
  it("does not grant Resist +1 to non-Darkwing Duck characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [honkerMuddlefootTimidGenius, nonDarkwingCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().hasKeyword(nonDarkwingCharacter, "Resist")).toBe(false);
  });

  it("grants Resist +1 to Darkwing Duck characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [honkerMuddlefootTimidGenius, darkwingDuckCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().hasKeyword(darkwingDuckCharacter, "Resist")).toBe(true);
  });
});
