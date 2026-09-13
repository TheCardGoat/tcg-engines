/**
 * AAA test for effect:gain-life.
 * Representative card: Song of Sweet Nectar Blue (TCC065) — Bard Action Song, cost 0.
 * Resolution effect: "Each other hero gains 1{h}."
 *   → effect: gain-life 1, target: each-other-hero
 *
 * Verifies that playing the card grants 1 life to the opponent (the only
 * "other hero" in a 2-player match).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, songOfSweetNectarBlue } from "../../../fixtures.ts";

describe("effect: gain-life", () => {
  it("AAA: playing Song of Sweet Nectar grants 1 life to the opponent", () => {
    // Arrange — Bravo has the song in hand. Dash starts at 18 life so the
    // +1 gain is clearly observable (not capped at max).
    const game = FabTestEngine.start(
      { hero: bravo, hand: [songOfSweetNectarBlue], deck: 4, resourcePoints: 0 },
      { hero: dash, life: 18, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const dashLifeBefore = Dash.life();
    const bravoLifeBefore = Bravo.life();

    // Act — Play Song of Sweet Nectar (cost 0).
    Bravo.play(songOfSweetNectarBlue);

    // Assert — Dash (the other hero) gains 1 life. Bravo does not.
    expect(Dash.life()).toBe(dashLifeBefore + 1);
    expect(Bravo.life()).toBe(bravoLifeBefore);
  });

  it("AAA boundary: the card resolves to graveyard after play", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [songOfSweetNectarBlue], deck: 4, resourcePoints: 0 },
      { hero: dash, life: 18, deck: 4 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(songOfSweetNectarBlue);

    // The non-attack action goes to graveyard after resolution.
    expect(Bravo.zone("graveyard")).toContain(songOfSweetNectarBlue.canonicalId);
  });
});
