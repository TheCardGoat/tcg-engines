/**
 * AAA test for effect:banish.
 * Representative card: Tome of Pandemonium (PEN277) — Chaos Action, cost 1, go again.
 * Resolution effect: sequence(banish top card of each hero's deck, optional play-card).
 * The banish step auto-resolves via position:"top" in objectTargets; the optional
 * play-card permission is auto-declined by the test harness during passBoth().
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, cosmicFlareRed, dash, tomeOfPandemoniumYellow } from "../../../fixtures.ts";

describe("effect: banish", () => {
  it("Arrange/Act/Assert: Tome of Pandemonium banishes top card of each hero's deck", () => {
    // Arrange — Both heroes have decks; Bravo can pay cost 1.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [tomeOfPandemoniumYellow], deck: 6, resourcePoints: 1 },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const bravoDeckBefore = Bravo.zone("deck").length;
    const dashDeckBefore = Dash.zone("deck").length;

    // Act — Play the action and let the stack resolve.
    Bravo.play(tomeOfPandemoniumYellow);
    game.passBoth();

    // Assert — Top card of each deck moved to banished zone.
    expect(Bravo.zone("deck").length).toBe(bravoDeckBefore - 1);
    expect(Dash.zone("deck").length).toBe(dashDeckBefore - 1);
    expect(Bravo.zone("banished").length).toBe(1);
    expect(Dash.zone("banished").length).toBe(1);
  });

  it("AAA boundary: without banish, banished zones stay empty", () => {
    // Arrange — Cosmic Flare is a Lightning Instant with gain-resources (no banish).
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cosmicFlareRed], deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Act
    Bravo.play(cosmicFlareRed);
    game.passBoth();

    // Assert — No banished cards.
    expect(Bravo.zone("banished").length).toBe(0);
    expect(Dash.zone("banished").length).toBe(0);
  });
});
