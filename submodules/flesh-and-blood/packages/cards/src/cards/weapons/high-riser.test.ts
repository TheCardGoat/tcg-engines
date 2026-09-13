import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { highRiser } from "./high-riser.ts";

/**
 * High Riser (BET002) — Guardian Weapon Hammer 1H, power 3.
 *
 * Printed: Once per Turn Action - {r}{r}{r}: Attack
 */

describe("High Riser (BET002) AAA", () => {
  it("happy: activateAttack opens combat at printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [highRiser],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(bravo).activateAttack(highRiser);

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: insufficient resources cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [highRiser],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).expectActivationRejected(highRiser);
    expectCombat(game).toBeClosed();
  });

  it("timing: once-per-turn rejects a second activation this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [highRiser],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(highRiser);
    game.closeCombat({ optionals: "decline" });
    Bravo.expectActivationRejected(highRiser);
  });
});
