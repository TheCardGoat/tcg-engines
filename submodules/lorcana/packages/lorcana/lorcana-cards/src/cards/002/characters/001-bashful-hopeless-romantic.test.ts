import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { bashfulHopelessRomantic } from "./001-bashful-hopeless-romantic";
import { happyGoodnatured } from "./011-happy-good-natured";

describe("Bashful - Hopeless Romantic", () => {
  it("OH, GOSH! This character can't quest unless you have another Seven Dwarfs character in play.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: happyGoodnatured.cost,
      hand: [happyGoodnatured],
      play: [{ card: bashfulHopelessRomantic }],
    });

    // Should have quest restriction when no other Seven Dwarfs in play
    expect(testEngine.asPlayerOne().getCard(bashfulHopelessRomantic)?.hasQuestRestriction).toBe(
      true,
    );

    // Play another Seven Dwarfs character
    expect(testEngine.asPlayerOne().playCard(happyGoodnatured)).toBeSuccessfulCommand();

    // Should no longer have quest restriction
    expect(testEngine.asPlayerOne().getCard(bashfulHopelessRomantic)?.hasQuestRestriction).toBe(
      false,
    );
  });
});
