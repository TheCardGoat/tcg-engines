import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { goldenGrail } from "../weapons/golden-grail.ts";
import { snatchRed } from "../actions/snatch.ts";
import { parryBlade } from "./parry-blade.ts";

/**
 * Parry Blade (HVY096) — Warrior Weapon Equipment Sword (1H) 2{p} d0, Blade Break.
 * Printed: "Once per Turn Action - {r}: Attack
 *           This gets +2{d} while defending a weapon attack."
 */

describe("Parry Blade (HVY096) AAA", () => {
  it("happy: pays {r} to attack at printed 2{p}; once-per-turn blocks a second swing", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [parryBlade],
        hand: [],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(parryBlade);
    expectCombat(game).toBeOpen().toHaveAttackPower(2);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(18); // 20 - 2
    expectFabPlayer(Bravo).toHaveResourceCount(0);

    // The attack is once per turn — a second activation is illegal.
    Bravo.expectActivationRejected(parryBlade);
  });

  it("boundary: while defending a weapon attack the blade defends for 2, then Blade Breaks", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, weapon1: [parryBlade], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activateAttack(goldenGrail);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(parryBlade);
    expectFabCard(Dash, parryBlade).toHaveDefense(2); // 0 base + 2 vs weapon attacks
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(19); // 20 - (3 - 2)
    expectFabCard(Dash, parryBlade).toBeIn("graveyard"); // Blade Break
  });

  it("boundary: the +2{d} does not apply against a non-weapon attack", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, weapon1: [parryBlade], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(parryBlade);
    expectFabCard(Dash, parryBlade).toHaveDefense(0);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16); // 20 - 4
  });
});
