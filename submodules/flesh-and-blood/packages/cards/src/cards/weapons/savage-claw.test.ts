import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { savageClaw } from "./savage-claw.ts";

/**
 * Savage Claw (PEN001) — Brute Weapon Claw 1H, power 3.
 *
 * Printed: Action - {r}{r}, {t}: Attack
 */

describe("Savage Claw (PEN001) AAA", () => {
  it("happy: activateAttack opens combat at printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [savageClaw],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(rhinar).activateAttack(savageClaw);

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: insufficient resources cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [savageClaw],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(rhinar).expectActivationRejected(savageClaw);
    expectCombat(game).toBeClosed();
  });

  it("timing: the tapped weapon cannot attack again this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [savageClaw],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activateAttack(savageClaw);
    game.closeCombat({ optionals: "decline" });
    expectFabCard(Rhinar, savageClaw).toBeTapped();
    Rhinar.expectActivationRejected(savageClaw);
  });
});
