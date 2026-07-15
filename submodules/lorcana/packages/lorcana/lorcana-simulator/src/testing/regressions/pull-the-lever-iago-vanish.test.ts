import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { iagoGiantSpectralParrot } from "@tcg/lorcana-cards/cards/007";
import { fireTheCannons } from "@tcg/lorcana-cards/cards/001";

/**
 * Regression for bug 30: Iago with Vanish should be BANISHED (moved to discard)
 * when chosen by an opponent's action, not returned to hand.
 *
 * Uses Fire the Cannons as a canonical character-targeting action — the same
 * "opponent chose my Iago" trigger path exercised in player-reported Pull the
 * Lever interactions (Pull the Lever itself does not choose characters, but
 * the underlying Vanish-on-chosen-by-opponent mechanic is what players
 * reported misbehaving).
 */
describe("Iago Giant Spectral Parrot (Vanish) is banished when chosen by opponent's action", () => {
  it("moves Iago to discard (not hand) when opponent targets him with an action", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
      },
      {
        play: [{ card: iagoGiantSpectralParrot, isDrying: false }],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, { targets: [iagoGiantSpectralParrot] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(iagoGiantSpectralParrot)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(iagoGiantSpectralParrot)).not.toBe("hand");
  });
});
