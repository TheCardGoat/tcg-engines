import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { hyperDriver } from "../tokens/hyper-driver.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { quickfireRed } from "./quickfire.ts";

/**
 * Quickfire (EVO225) — Mechanologist Action, cost 2, 2{d}, go again.
 *
 * Printed: "This costs {r} less to play for each Hyper Driver you control.
 * The next attack you boost this turn gets +4{p}.
 * Go again"
 *
 * Cost static matches Amplify the Arknight (self-cost from hand). The +4 latch
 * is the same `hasStatus: "boosted"` appliesTo.next filter as Gas Up / Bios
 * Update.
 */

describe("Quickfire (EVO225) AAA", () => {
  it("happy: 2 Hyper Drivers you control play this for 0{r} and go again refunds", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [quickfireRed],
        arena: [
          { card: hyperDriver, state: { steamCounters: 1 } },
          { card: hyperDriver, state: { steamCounters: 1 } },
        ],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(quickfireRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, quickfireRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveResourceCount(2).toHaveAP(1);
  });

  it("boundary: with no Hyper Drivers, 1{r} cannot pay the printed 2{r} cost", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [quickfireRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expect(() => Dash.play(quickfireRed)).toThrow();
    expectFabCard(Dash, quickfireRed).toBeIn("hand");
    expectFabPlayer(Dash).toHaveResourceCount(1);
  });

  it("timing: opponent Hyper Drivers do not discount; the next boosted attack gets +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [quickfireRed, zeroToSixtyRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: azalea,
        hand: [],
        arena: [
          { card: hyperDriver, state: { steamCounters: 1 } },
          { card: hyperDriver, state: { steamCounters: 1 } },
        ],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(quickfireRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveResourceCount(0);

    Dash.must.playAttack(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("defend");
    // Zero to Sixty base 4 + 4 from Quickfire.
    expectCombat(game).toHaveAttackPower(8);
  });
});
