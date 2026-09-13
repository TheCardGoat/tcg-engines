import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { clawOfVynserakai } from "./claw-of-vynserakai.ts";

/**
 * Claw of Vynserakai (SEA257) — Draconic Weapon Dagger 1H, power 1.
 *
 * Printed: Once per Turn Action - {r}: Attack
 */

describe("Claw of Vynserakai (SEA257) AAA", () => {
  it("happy: activateAttack opens combat at printed 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        weapon1: [clawOfVynserakai],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(fai).activateAttack(clawOfVynserakai);

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(1);
  });

  it("boundary: insufficient resources cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        weapon1: [clawOfVynserakai],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(fai).expectActivationRejected(clawOfVynserakai);
    expectCombat(game).toBeClosed();
  });

  it("timing: once-per-turn rejects a second activation this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        weapon1: [clawOfVynserakai],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Fai = game.as(fai);

    Fai.activateAttack(clawOfVynserakai);
    game.closeCombat({ optionals: "decline" });
    Fai.expectActivationRejected(clawOfVynserakai);
  });
});
