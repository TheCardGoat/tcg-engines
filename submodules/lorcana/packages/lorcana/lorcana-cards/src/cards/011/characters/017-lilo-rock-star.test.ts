import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { liloRockStar } from "./017-lilo-rock-star";

const cheapDiscardCharacter = createMockCharacter({
  id: "lilo-rock-star-cheap-discard-character",
  name: "Cheap Discard Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const expensiveDiscardCharacter = createMockCharacter({
  id: "lilo-rock-star-expensive-discard-character",
  name: "Expensive Discard Character",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Lilo - Rock Star", () => {
  it("may play a character with cost 2 or less from your discard for free when she quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: liloRockStar, isDrying: false }],
      discard: [cheapDiscardCharacter],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().quest(liloRockStar)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(liloRockStar, {
        resolveOptional: true,
        targets: [cheapDiscardCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(cheapDiscardCharacter)).toBe("play");
  });

  it("does not play a character with cost greater than 2 from your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: liloRockStar, isDrying: false }],
      discard: [expensiveDiscardCharacter],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().quest(liloRockStar)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    expect(testEngine.asPlayerOne().getCardZone(expensiveDiscardCharacter)).toBe("discard");
  });
});
