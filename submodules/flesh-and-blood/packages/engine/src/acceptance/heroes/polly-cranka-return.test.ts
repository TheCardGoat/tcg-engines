/**
 * SEA003 Polly Cranka — banish-and-return acceptance.
 *
 * CR 5.2.1c/5.2.2 governs the Action activation and its tap/banish costs.
 * CR 1.3.3a means Polly stops being equipped when it leaves the arena.
 */
import { describe, expect, it } from "vitest";

import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

import { pollyCranka } from "../../../../cards/src/cards/companions/polly-cranka.ts";

describe("Polly Cranka return (SEA003)", () => {
  it("AAA: banishes equipped Polly, then returns it tapped and unequipped as a permanent", () => {
    const game = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      { hero: dash, weapon1: [pollyCranka], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.endTurn();
    Dash.activate(pollyCranka);
    game.passBoth();

    expect(Dash.zone("weapon1")).not.toContain(pollyCranka.canonicalId);
    expect(Dash.zone("arena")).toContain(pollyCranka.canonicalId);
    // Returning from an ability is not playing a card, so it does not invoke
    // Crank; the Action point remains spent.
    expect(Dash.actionPoints()).toBe(0);
    // The returned Polly has a steam counter (CR 5.3.4, 8.3.29).
    const pollyId = Dash.findCardInZone("arena", pollyCranka);
    expect(game.objectState(pollyId).steamCounters).toBe(1);
    // The returned Polly is tapped and cannot be activated again.
    expect(() => Dash.activate(pollyCranka)).toThrow(/tap|tapped|cost|activate/i);
  });
});
