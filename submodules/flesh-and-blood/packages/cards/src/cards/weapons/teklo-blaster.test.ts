import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { tekloBlaster } from "./teklo-blaster.ts";

/**
 * Teklo Blaster (TCC002) — Mechanologist Weapon Gun 2H, power 2.
 *
 * Printed: Once per Turn Action - {r}{r}{r}: Attack
 */

describe("Teklo Blaster (TCC002) AAA", () => {
  it("happy: activateAttack opens combat at printed 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [tekloBlaster],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );

    game.as(dash).activateAttack(tekloBlaster);

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(2);
  });

  it("boundary: insufficient resources cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [tekloBlaster],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).expectActivationRejected(tekloBlaster);
    expectCombat(game).toBeClosed();
  });

  it("timing: once-per-turn rejects a second activation this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [tekloBlaster],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activateAttack(tekloBlaster);
    game.closeCombat({ optionals: "decline" });
    Dash.expectActivationRejected(tekloBlaster);
  });
});
