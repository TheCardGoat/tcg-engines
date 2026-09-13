import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { crossTheLineRed } from "./cross-the-line.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { banneretOfResilienceYellow } from "./banneret-of-resilience.ts";

/**
 * Banneret of Resilience, Yellow (DTD054) — Light Warrior Action - Attack,
 * cost 0, 3{p}.
 * Printed: "When this is charged to your hero's soul, the next action card
 * you defend with this turn gets +1{d}."
 *
 * 1v1 note: charging happens via playing an attack action on your own turn,
 * and defending only happens on the opponent's turn — the printed same-turn
 * window is not reachable by any legal sequence, so the suite pins the
 * charge seating and the printed turn-boundary expiry of the +1{d} latch.
 */

describe("Banneret of Resilience, Yellow (DTD054) AAA", () => {
  it("timing: charging this to soul seats it there", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, banneretOfResilienceYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(crossTheLineRed, {
      charge: true,
      chargeCard: banneretOfResilienceYellow,
    });
    game.closeCombat();

    expectFabCard(Boltyn, banneretOfResilienceYellow).toBeIn("soul");
  });

  it("boundary: charging a different card leaves this in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, banneretOfResilienceYellow, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(crossTheLineRed, { charge: true, chargeCard: nimblismBlue });
    game.closeCombat();

    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
    expectFabCard(Boltyn, banneretOfResilienceYellow).toBeIn("hand");
  });

  it("timing: the +1{d} latch expires at the turn boundary (printed 'this turn')", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, banneretOfResilienceYellow, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.attackWith(crossTheLineRed, {
      charge: true,
      chargeCard: banneretOfResilienceYellow,
    });
    game.closeCombat();
    Boltyn.endTurn();
    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Boltyn.defendWith([nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    // Snatch 4 vs Nimblism 2{d}: printed latch expired with the turn —
    // no +1{d}, so 2 damage carries. (A 19 would mean the latch
    // over-scoped past its printed this-turn window.)
    expectFabPlayer(Boltyn).toHaveLife(18);
  });
});
