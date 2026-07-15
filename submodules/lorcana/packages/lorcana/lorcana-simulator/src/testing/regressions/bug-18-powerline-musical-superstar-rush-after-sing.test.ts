import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { suddenChill } from "@tcg/lorcana-cards/cards/001";
import { powerlineMusicalSuperstar } from "@tcg/lorcana-cards/cards/009";

/**
 * BUG 18: Powerline - Musical Superstar "ELECTRIC MOVE":
 * "If you've played a song this turn, this character gains Rush this turn."
 * Singing a song is playing a song, so after singSong Powerline must have Rush.
 */
describe("bug-18 — Powerline Musical Superstar keeps Rush after singing a song", () => {
  it("does not have Rush before any song is played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: powerlineMusicalSuperstar, isDrying: false }],
      hand: [suddenChill],
      inkwell: suddenChill.cost,
      deck: 2,
    });

    expect(testEngine.hasKeyword(powerlineMusicalSuperstar, "Rush")).toBe(false);
  });

  it("gains Rush after singing a song (song counts as played)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: powerlineMusicalSuperstar, isDrying: false }],
        hand: [suddenChill],
        deck: 2,
      },
      {
        hand: [suddenChill],
        deck: 2,
      },
    );

    // Powerline cost 3 >= suddenChill cost 2 → valid singer.
    expect(
      testEngine.asPlayerOne().singSong(suddenChill, powerlineMusicalSuperstar),
    ).toBeSuccessfulCommand();

    // After singing, Powerline must have Rush this turn.
    expect(testEngine.hasKeyword(powerlineMusicalSuperstar, "Rush")).toBe(true);
  });
});
