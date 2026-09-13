import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { mandibleClaw } from "./mandible-claw.ts";

/**
 * Mandible Claw (CRU004) — Brute Weapon Claw 1H, power 3.
 *
 * Printed: Once per Turn Action - {r}{r}: Attack
 */

describe("Mandible Claw (CRU004) AAA", () => {
  it("happy: activateAttack opens combat at printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [mandibleClaw],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(rhinar).activateAttack(mandibleClaw);

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: insufficient resources cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [mandibleClaw],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(rhinar).expectActivationRejected(mandibleClaw);
    expectCombat(game).toBeClosed();
  });

  it("timing: once-per-turn rejects a second activation this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [mandibleClaw],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activateAttack(mandibleClaw);
    game.closeCombat({ optionals: "decline" });
    Rhinar.expectActivationRejected(mandibleClaw);
  });
});
