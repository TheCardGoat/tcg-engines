import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { cogsworthIlluminaryWatchman } from "./037-cogsworth-illuminary-watchman";

const targetCharacter = createMockCharacter({
  id: "cogsworth-illuminary-watchman-target",
  name: "Target Character",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Cogsworth - Illuminary Watchman", () => {
  it("gives a chosen character Rush when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cogsworthIlluminaryWatchman],
      inkwell: cogsworthIlluminaryWatchman.cost,
      play: [targetCharacter],
    });

    expect(testEngine.hasKeyword(targetCharacter, "Rush")).toBe(false);
    expect(testEngine.asPlayerOne().playCard(cogsworthIlluminaryWatchman)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();
    if (!bagEffect) {
      return;
    }

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(cogsworthIlluminaryWatchman, {
        targets: [targetCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.hasKeyword(targetCharacter, "Rush")).toBe(true);
    expect(testEngine.hasKeyword(cogsworthIlluminaryWatchman, "Rush")).toBe(false);
  });
});
