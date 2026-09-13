import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhimGrandfatherOfEternity } from "../heroes/oldhim-grandfather-of-eternity.ts";
import { frostFangBlue } from "./frost-fang.ts";
import { snatchRed } from "./snatch.ts";
import { ladenWithFrostRed } from "./laden-with-frost.ts";

/**
 * Laden with Frost (PEN211) — Elemental Action, red.
 *
 * Printed: Your next attack this turn gets +3{p}. Ice Bond - If an Ice
 * card was pitched to play this, create a Frostbite token under target
 * hero's control. Go again
 */

describe("Laden with Frost (PEN211) AAA", () => {
  it("boundary: without an Ice pitch, the next attack still gets +3{p} and no Frostbite", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [ladenWithFrostRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Oldhim.play(ladenWithFrostRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Oldhim).toHaveTokenCount("frostbite", 0);
    Oldhim.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("happy: pitching an Ice card creates a Frostbite under the targeted hero", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [ladenWithFrostRed, frostFangBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);
    const Dash = game.as(dash);

    Oldhim.play(ladenWithFrostRed, { pitch: [frostFangBlue] });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 1);
  });

  it("timing: still defends for its printed 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [ladenWithFrostRed],
        life: 40,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Dash.playAttack(snatchRed);
    Oldhim.defendWith(ladenWithFrostRed);
    game.helpers.resolveRestOfCombat();

    // Snatch 4{p} vs 2{d} = 2 damage.
    expectFabPlayer(Oldhim).toHaveLife(38);
    expectFabCard(Oldhim, ladenWithFrostRed).toBeIn("graveyard");
  });
});
