/**
 * AAA test for trigger:banish.
 * Representative card: Fast and Furious Red (AIO009) — Mechanologist Attack.
 * Triggered ability: "When this is banished from boosting, put a steam counter
 * on an item you control with crank."
 *
 * F&F must be the top deck card banished by another card's boost keyword.
 * The boost banish event marks the card with "from-boosting" status so the
 * trigger filter can match (CR 8.3.9e).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { grindingGearsBlue } from "../../../../../../cards/src/cards/actions/grinding-gears.ts";
import { fastAndFuriousRed } from "../../../../../../cards/src/cards/actions/fast-and-furious.ts";

describe("trigger: banish", () => {
  it("AAA: Fast and Furious adds a steam counter to a crank item when banished from boosting (CR 8.3.9e)", () => {
    // Arrange — Dash has Grinding Gears (crank item) in the arena, F&F in hand
    // (cost 0 boost attack), and another F&F on top of the deck to be banished.
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [grindingGearsBlue],
        hand: [fastAndFuriousRed],
        deck: [fastAndFuriousRed, fastAndFuriousRed, fastAndFuriousRed, fastAndFuriousRed],
      },
      { hero: bravo, deck: 4 },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    // Capture enter-arena steam before boost so the assertion is relative.
    const gearsId = Dash.findCardInZone("arena", grindingGearsBlue);
    const before =
      Dash.getState()
        .objects[gearsId]?.counters.filter((c) => c.kind === "named" && c.name === "steam")
        .reduce((sum, c) => sum + (c.kind === "named" ? c.count : 0), 0) ?? 0;

    // Act — play F&F from hand with boost; boost banishes the top deck card
    // (another F&F) with "from-boosting" status, firing its trigger.
    Dash.play(fastAndFuriousRed, { boost: true, target: Bravo.id });
    game.passBoth();
    game.passBoth();
    game.passBoth();
    game.passBoth();

    // Assert — banished F&F's boost-banish trigger added at least one steam
    // counter to Grinding Gears.
    const after =
      Dash.getState()
        .objects[gearsId]?.counters.filter((c) => c.kind === "named" && c.name === "steam")
        .reduce((sum, c) => sum + (c.kind === "named" ? c.count : 0), 0) ?? 0;
    expect(after).toBeGreaterThan(before);
  });
});
