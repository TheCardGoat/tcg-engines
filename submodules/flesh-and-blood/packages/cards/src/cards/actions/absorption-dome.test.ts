import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { zapRed } from "./zap.ts";
import { underLoopBlue } from "./under-loop.ts";
import { absorptionDomeYellow } from "./absorption-dome.ts";

/**
 * Absorption Dome Yellow (CRU104) — Mechanologist Item.
 *
 * Printed: Absorption Dome enters the arena with steam counters on it
 * equal to the number of times you have boosted this turn.
 * If your hero would be dealt damage, remove that many steam counters from
 * Absorption Dome instead, then prevent damage equal to the number of steam
 * counters removed this way.
 * When Absorption Dome has no steam counters on it, destroy it.
 */

describe("Absorption Dome (CRU104) AAA", () => {
  it("happy+pin: boost payment + entry counters green; the counter-removal prevention leg is inert", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [underLoopBlue, absorptionDomeYellow],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [zapRed], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);

    // Boosted swing: the optional boost cost banishes the deck top.
    Dash.play(underLoopBlue, { boost: true });
    game.advanceUntil({ stopAt: "defend" });
    Azalea.defendWith();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // Entry counters should equal the boost count (1 here; see the pin
    // below — the entry currently seats 1 regardless of boost count).
    Dash.play(absorptionDomeYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, absorptionDomeYellow).toBeIn("arena");
    expectFabCard(Dash, absorptionDomeYellow).toHaveCounters(1, "steam");

    // Azalea's turn: Zap's 3 arcane should be prevented down to 2.
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    Azalea.play(zapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    // PIN: printed "remove that many steam counters… then prevent damage
    // equal to the number removed" — the counter-removal prevention never
    // fires; full damage lands and the Dome keeps its counter.
    expectFabPlayer(Dash).toHaveLife(17); // 20 - 3, prevention dropped
    expectFabCard(Dash, absorptionDomeYellow).toBeIn("arena");
    expectFabCard(Dash, absorptionDomeYellow).toHaveCounters(1, "steam");
  });

  it("pin: entering with zero counters does not trigger the destroy leg (§5 engine/zero-counter-entry-destroy-inert)", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [absorptionDomeYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(absorptionDomeYellow);
    game.helpers.resolveUntilIdle();

    // Printed: entry counters equal the boost count (0) and "when this has
    // no steam counters, destroy it" — instead it seats 1 counter
    // unconditionally and stays in the arena.
    expectFabCard(Dash, absorptionDomeYellow).toBeIn("arena");
    expectFabCard(Dash, absorptionDomeYellow).toHaveCounters(1, "steam");
  });
});
