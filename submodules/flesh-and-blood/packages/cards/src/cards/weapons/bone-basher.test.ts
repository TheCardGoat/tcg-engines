import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { boneBasher } from "./bone-basher.ts";

/**
 * Bone Basher (RVD002) — Brute Weapon Club 2H, power 4.
 *
 * Printed: Once per Turn Action - {r}{r}: Attack
 */

describe("Bone Basher (RVD002) AAA", () => {
  it("happy: activateAttack opens combat at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [boneBasher],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(rhinar).activateAttack(boneBasher);

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: insufficient resources cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [boneBasher],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(rhinar).expectActivationRejected(boneBasher);
    expectCombat(game).toBeClosed();
  });

  it("timing: once-per-turn rejects a second activation this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [boneBasher],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activateAttack(boneBasher);
    game.closeCombat({ optionals: "decline" });
    Rhinar.expectActivationRejected(boneBasher);
  });
});
