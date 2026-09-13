import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultRed } from "../actions/brutal-assault.ts";
import { bloodiedGauntlet } from "./bloodied-gauntlet.ts";

/**
 * Bloodied Gauntlet (SMP016) — Event Arms d0.
 *
 * Printed:
 *   You may equip this.
 *   Action - Destroy this: The next attack action card you play this turn
 *   gets +2{p}. Go again
 *
 * Silken Gi family twin of Bloodied Strapping: the destroyed arms grant power
 * (not a cost discount) to the next attack action only.
 */

describe("Bloodied Gauntlet (SMP016) AAA", () => {
  it("happy: destroy the arms so the next attack action gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [bloodiedGauntlet],
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(bloodiedGauntlet);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, bloodiedGauntlet).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);

    Bravo.playAttack(brutalAssaultRed);
    expectCombat(game).toHaveAttackPower(8);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(12);
  });

  it("boundary: without the gauntlet the same attack stays printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(brutalAssaultRed);
    expectCombat(game).toHaveAttackPower(6);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("timing: only the next attack action this turn gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [bloodiedGauntlet],
        hand: [brutalAssaultRed, brutalAssaultRed],
        actionPoints: 2,
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(bloodiedGauntlet);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(brutalAssaultRed);
    expectCombat(game).toHaveAttackPower(8);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    Bravo.playAttack(brutalAssaultRed);
    expectCombat(game).toHaveAttackPower(6);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(26);
  });
});
