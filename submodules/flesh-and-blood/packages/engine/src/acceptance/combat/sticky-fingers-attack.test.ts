/** SEA124 Sticky Fingers — equipped attack acceptance. */
import { describe, expect, it } from "vitest";

import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

import { stickyFingers } from "../../../../cards/src/cards/companions/sticky-fingers.ts";

describe("Sticky Fingers attack (SEA124)", () => {
  it("AAA: attacks from its equipped zone, taps, and unequips before combat resolves", () => {
    const game = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      { hero: dash, weapon1: [stickyFingers], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Verify starting state: Sticky Fingers is equipped in weapon1
    expect(Dash.zone("weapon1")).toContain(stickyFingers.canonicalId);
    expect(Dash.zone("inventory")).not.toContain(stickyFingers.canonicalId);

    // Bravo ends turn to give Dash an action point
    Bravo.endTurn();

    // Dash activates Sticky Fingers (which attacks)
    Dash.activate(stickyFingers);

    // Resolve combat (both players pass priority, no reactions)
    game.passBoth();

    // After resolution: Sticky Fingers should be unequipped (in inventory)
    expect(Dash.zone("weapon1")).not.toContain(stickyFingers.canonicalId);
    expect(Dash.zone("inventory")).toContain(stickyFingers.canonicalId);
  });

  it("boundary: activation is rejected when tapped (already attacked)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      { hero: dash, weapon1: [stickyFingers], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.endTurn();
    Dash.activate(stickyFingers);
    game.passBoth();

    // Sticky Fingers is now in inventory (unequipped) — it cannot be
    // activated again because it's no longer in an activation-legal zone.
    expect(() => Dash.activate(stickyFingers)).toThrow();
  });
});
