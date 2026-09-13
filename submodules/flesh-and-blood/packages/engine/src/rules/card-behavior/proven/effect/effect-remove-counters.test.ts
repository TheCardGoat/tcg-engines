/**
 * AAA test for effect:remove-counters.
 * Representative card: Optekal Monocle (ARC037) — Mechanologist Action Item.
 * Activated ability: "Action - Remove a steam counter: Opt 1. Go again"
 * The cost type is remove-counters (constant count, named counter on source).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, optekalMonocle, nimblismBlue } from "../../../fixtures.ts";

describe("effect: remove-counters", () => {
  it("Arrange/Act/Assert: activating Optekal Monocle removes exactly 1 steam counter via remove-counters cost", () => {
    // Arrange — play the real card to apply its enter-arena replacement. Two
    // action points let this test both play the Action Item and activate it.
    const game = FabTestEngine.start(
      { hero: bravo, actionPoints: 2, hand: [optekalMonocle], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    // The response-free stack resolves, returning priority to Bravo for the
    // activation below.
    Bravo.play(optekalMonocle);
    const id = Bravo.findCardInZone("arena", optekalMonocle);
    expect(game.objectState(id)?.steamCounters).toBe(5);

    // Act — Activate the "Remove a steam counter: Opt 1" ability (costs 1 AP).
    // The remove-counters cost is paid at activation time, before the opt
    // effect layer resolves. We verify the counter immediately.
    Bravo.activate(optekalMonocle);

    // Assert — Exactly 1 steam counter was consumed by the cost.
    expect(game.objectState(id)?.steamCounters).toBe(4);
    // Card still in arena (state trigger requires 0 counters to destroy).
    expect(Bravo.zone("arena")).toContain(optekalMonocle.canonicalId);
  });

  it("AAA boundary: a card without remove-counters cost does not lose steam counters when activated", () => {
    // Arrange — the real enter-arena replacement supplies Optekal's counters.
    const game = FabTestEngine.start(
      { hero: bravo, actionPoints: 2, deck: 4, hand: [optekalMonocle, nimblismBlue] },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    // Each response-free stack window resolves before the next play.
    Bravo.play(optekalMonocle);
    const id = Bravo.findCardInZone("arena", optekalMonocle);
    expect(game.objectState(id)?.steamCounters).toBe(5);

    // Act — Play a different card (nimblismBlue has no remove-counters interaction).
    Bravo.play(nimblismBlue);

    // Assert — Steam counters on Optekal Monocle unchanged.
    expect(game.objectState(id)?.steamCounters).toBe(5);
  });
});
