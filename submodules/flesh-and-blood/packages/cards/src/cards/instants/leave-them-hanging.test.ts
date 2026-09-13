import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { leaveThemHangingRed } from "./leave-them-hanging.ts";

/**
 * Leave Them Hanging (SUP074) — Reviled Guardian Instant - Aura (Suspense).
 *
 * Printed: "Suspense\nWhen this enters or leaves the arena, intimidate target
 * hero.\nWhen this leaves the arena, your next attack this turn gets +4{p}."
 *
 * Rules: CR 8.3.42 Suspense (enter with 2 counters, remove one at the start of
 * your turn, destroy when none remain), CR 8.5.10 Intimidate (banish a random
 * card from the target's hand face-down; it returns at the beginning of the
 * end phase), CR 8.5.10b (1v1: the sole opponent is the target).
 */

describe("Leave Them Hanging (SUP074) AAA", () => {
  it("happy: entering the arena seats 2 suspense counters and intimidates the sole opposing hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [leaveThemHangingRed], resourcePoints: 3, deck: 6 },
      { hero: dash, hand: [snatchRed, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(leaveThemHangingRed);
    game.helpers.resolveUntilIdle(); // drains the enter-arena trigger layer

    expectFabCard(Bravo, leaveThemHangingRed).toBeIn("arena");
    expectFabCard(Bravo, leaveThemHangingRed).toHaveCounters(2, "suspense");
    // CR 8.5.10: a random card left dash's hand for a face-down banish.
    expectFabPlayer(Dash).toHaveHandCount(1);
    expect(Dash.zone("banished")).toHaveLength(1);
  });

  it("boundary: intimidating an empty hand banishes nothing and the aura still seats", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [leaveThemHangingRed], resourcePoints: 3, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(leaveThemHangingRed);
    game.helpers.resolveUntilIdle();

    // CR 8.5.10a: the hero is still intimidated with no card to banish — no crash.
    expectFabCard(Bravo, leaveThemHangingRed).toBeIn("arena");
    expectFabCard(Bravo, leaveThemHangingRed).toHaveCounters(2, "suspense");
    expect(Dash.zone("banished")).toHaveLength(0);
  });

  it("timing: suspense expiry leaves the arena — the leave leg intimidates again and the turn's next attack gets +4{p}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [leaveThemHangingRed], hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [snatchRed, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Two full turn cycles burn both suspense counters (CR 8.3.42).
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Bravo, leaveThemHangingRed).toBeIn("graveyard");
    // Leave-arena intimidate: dash drew twice (hand 4) and lost one random card.
    expect(Dash.zone("banished")).toHaveLength(1);
    expectFabPlayer(Dash).toHaveHandCount(3);

    // a2: the next attack this turn gets +4{p} (4 base + 4).
    Bravo.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(8);
    game.helpers.resolveRestOfCombat();

    // CR 8.5.10: the intimidated card returns at the beginning of the end phase.
    Bravo.endTurn();
    game.helpers.untilIdle();
    expectFabPlayer(Dash).toHaveHandCount(4);
    expect(Dash.zone("banished")).toHaveLength(0);
  });
});
