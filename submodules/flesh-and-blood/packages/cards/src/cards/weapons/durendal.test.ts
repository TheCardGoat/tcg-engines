import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { unmovableRed } from "../defense-reactions/unmovable.ts";
import { durendal } from "./durendal.ts";

/**
 * Durendal (MPW008) — Warrior Weapon - Sword (2H), 3{p}.
 *
 * Printed:
 *   Once per Turn Action - {r}: Attack
 *   If this has a +1{p} counter, reaction cards get -1{d} while defending it.
 */

describe("Durendal (MPW008) AAA", () => {
  it("happy: with a +1{p} counter, a defending reaction card gets -1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [{ card: durendal, state: { powerCounterTotal: 1 } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [unmovableRed], life: 20, resourcePoints: 3, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.activateAttack(durendal);
    expectCombat(game).toHaveAttackPower(4);
    Dash.defendWith();
    Dori.pass();
    Dash.pass();
    Dori.pass();
    Dash.play(unmovableRed);
    game.passBoth();

    expectFabCard(Dash, unmovableRed).toHaveDefense(6);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: without the +1{p} counter the reaction defends at printed {d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [durendal],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [unmovableRed], life: 20, resourcePoints: 3, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.activateAttack(durendal);
    expectCombat(game).toHaveAttackPower(3);
    Dash.defendWith();
    Dori.pass();
    Dash.pass();
    Dori.pass();
    Dash.play(unmovableRed);
    game.passBoth();

    expectFabCard(Dash, unmovableRed).toHaveDefense(7);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
