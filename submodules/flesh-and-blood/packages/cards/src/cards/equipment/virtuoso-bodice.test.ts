import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tensionInTheAirRed } from "../instants/tension-in-the-air.ts";
import { virtuosoBodice } from "./virtuoso-bodice.ts";

/**
 * Virtuoso Bodice (APS005) — Guardian Equipment - Chest.
 *
 * Printed: When this defends, you may remove a suspense counter from an aura
 * you control. If you do, gain {r}{r}. Blade Break.
 */

describe("Virtuoso Bodice (APS005) AAA", () => {
  it("happy: removing a suspense counter on defense gains {r}{r}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        chest: [virtuosoBodice],
        arena: [tensionInTheAirRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(virtuosoBodice);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    // The aura entered with two suspense counters; one was removed.
    expectFabCard(Bravo, tensionInTheAirRed).toHaveCounters(1, "suspense");
    // Empty-hand seating starts at 3 RP; the bodice gains {r}{r}.
    expectFabPlayer(Bravo).toHaveResourceCount(5);
    expectFabCard(Bravo, virtuosoBodice).toBeIn("graveyard");
  });

  it("boundary: declining the removal gains no {r} and keeps both counters", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        chest: [virtuosoBodice],
        arena: [tensionInTheAirRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(virtuosoBodice);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Bravo, tensionInTheAirRed).toHaveCounters(2, "suspense");
    expectFabPlayer(Bravo).toHaveResourceCount(3);
  });
});
