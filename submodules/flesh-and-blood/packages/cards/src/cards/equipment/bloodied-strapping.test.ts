import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultRed } from "../actions/brutal-assault.ts";
import { bloodiedStrapping } from "./bloodied-strapping.ts";

/**
 * Bloodied Strapping (SMP015) — Event Chest d0.
 *
 * Printed:
 *   You may equip this.
 *   Action - Destroy this: The next attack action card you play this turn
 *   costs {r}{r} less to play. Go again
 *
 * Silken Gi family golden: activate destroys the chest, go again refunds the
 * action point, and the next attack action is discounted (not its power).
 */

describe("Bloodied Strapping (SMP015) AAA", () => {
  it("happy: destroy the chest so the next attack action costs {r}{r} less", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodiedStrapping],
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(bloodiedStrapping);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, bloodiedStrapping).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);

    Bravo.playAttack(brutalAssaultRed);
    expectCombat(game).toHaveAttackPower(6);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("boundary: without the discount a cost-2 attack cannot be paid at 0{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabUnplayable(() => game.as(bravo).playAttack(brutalAssaultRed));
    expectFabCard(game.as(bravo), brutalAssaultRed).toBeIn("hand");
  });

  it("timing: only the next attack action this turn is discounted", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodiedStrapping],
        hand: [brutalAssaultRed, brutalAssaultRed],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(bloodiedStrapping);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(brutalAssaultRed);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveResourceCount(2);

    Bravo.playAttack(brutalAssaultRed);
    expectCombat(game).toHaveAttackPower(6);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveResourceCount(0);

    expectFabPlayer(Dash).toHaveLife(28);
  });
});
