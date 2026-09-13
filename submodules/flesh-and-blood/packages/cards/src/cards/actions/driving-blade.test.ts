import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { drivingBladeRed } from "./driving-blade.ts";

/**
 * Driving Blade (TEA012) — Warrior Action, cost 2, 3{d}, go again.
 *
 * Printed: Your next weapon attack this turn gains +3{p} and go again.
 * Go again
 */

describe("driving-blade family AAA", () => {
  it("happy: the next weapon attack this turn gains +3{p} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [drivingBladeRed],
        weapon1: [cintariSaber],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: kano, hand: [], life: 15, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(drivingBladeRed);
    game.untilIdle();
    expectFabCard(Boltyn, drivingBladeRed).toBeIn("graveyard");
    expectFabPlayer(Boltyn).toHaveAP(1);

    Boltyn.activateAttack(cintariSaber);
    expectCombat(game).toHaveAttackPower(5).toHaveKeyword("go-again");
    game.untilIdle({ optionals: "decline", ordering: "listed", entityTargets: "minimum" });
    expectFabPlayer(game.as(kano)).toHaveLife(10);
    expectFabPlayer(Boltyn).toHaveAP(1);
  });

  it("boundary: a non-weapon attack is not buffed and does not gain go again", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [drivingBladeRed, brutalAssaultBlue],
        weapon1: [cintariSaber],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: kano, hand: [], life: 15, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(drivingBladeRed);
    game.untilIdle();
    Boltyn.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4).notToHaveKeyword("go-again");
  });

  it("timing: the grant is consumed by the first weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [drivingBladeRed],
        weapon1: [cintariSaber],
        weapon2: [cintariSaber],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: kano, hand: [], life: 15, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(drivingBladeRed);
    game.untilIdle();
    Boltyn.activateAttack(cintariSaber, { index: 0 });
    expectCombat(game).toHaveAttackPower(5).toHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline" });

    Boltyn.activateAttack(cintariSaber, { index: 1 });
    expectCombat(game).toHaveAttackPower(2).notToHaveKeyword("go-again");
  });
});
