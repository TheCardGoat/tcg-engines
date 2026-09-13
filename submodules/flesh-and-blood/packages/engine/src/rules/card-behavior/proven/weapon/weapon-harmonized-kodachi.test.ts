/**
 * KSU003 Harmonized Kodachi — Ninja Dagger 1H — power 1.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}: Attack
 *   a2: If you have a card in your pitch zone with cost 0, this card's
 *       attacks get go again.
 *
 * Reasoning (hand-authored):
 * 1. a1 (1-power dagger, no native go again, OPT) already proven @
 *    weapon-equipment-next; this file proves the a2 go-again clause.
 * 2. a2: continuous static gated on zone-count (pitch zone, cost eq 0)
 *    granting go again to this card's attacks — the zone-count cost filter
 *    shape proven by anothos/titan-s-fist (numeric base cost) and the
 *    grant-go-again-to-attack outcome proven by AHA002 a2 / quick-clicks
 *    (AP refund after combat).
 * 3. Happy: a cost-0 card (Snatch) sits in the pitch zone → the kodachi
 *    attack refunds AP. Boundary: only a cost-3 card (Unmovable) pitched →
 *    no go again (AP spent).
 *
 * Status: ✅ a2 cost-0-pitch go again proven (AP refund); cost-3-pitch
 * boundary no-go-again (a1 @ weapon-equipment-next).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, unmovableRed } from "../../../fixtures.ts";

import { harmonizedKodachi } from "../../../../../../cards/src/cards/weapons/harmonized-kodachi.ts";

const LIFE = 40;

describe("harmonized-kodachi (KSU003)", () => {
  it("a2: cost-0 card in pitch → this attack gets go again (AP refund)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [harmonizedKodachi],
        // Snatch is cost 0 — satisfies the pitch-zone cost-0 gate.
        pitch: [snatchRed],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    expect(Bravo.zone("pitch")).toContain(snatchRed.canonicalId);

    Bravo.activate(harmonizedKodachi);
    game.helpers.resolveRestOfCombat();

    // 1 damage dealt; go again refunded the spent action point.
    expect(Opp.life()).toBe(lifeBefore - 1);
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("a2 boundary: no cost-0 card in pitch → no go again (AP spent)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [harmonizedKodachi],
        // Unmovable is cost 3 — the cost-0 gate stays closed.
        pitch: [unmovableRed],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(harmonizedKodachi);
    game.helpers.resolveRestOfCombat();

    expect(Bravo.actionPoints()).toBe(0);
  });
});
