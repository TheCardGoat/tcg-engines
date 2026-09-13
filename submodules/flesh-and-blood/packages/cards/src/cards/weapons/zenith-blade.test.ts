import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { zenithBlade } from "./zenith-blade.ts";

/**
 * Zenith Blade (AHA002) — Warrior Weapon Sword 2H, power 3.
 *
 * Printed:
 *   Hala Specialization
 *   Once per Turn Action - {r}: Attack
 *   If this has been sharpened this turn, its first attack this turn gets go again.
 */

describe("Zenith Blade (AHA002) AAA", () => {
  it("happy: activateAttack opens combat at printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    expectFabCard(Hala, zenithBlade).toBeIn("weapon1");
    Hala.activateAttack(zenithBlade);

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: without sharpen this turn, the first attack does not get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.activateAttack(zenithBlade);

    expectCombat(game).notToHaveKeyword("go-again");
    expectFabPlayer(Hala).toHaveAP(0);
  });

  it("timing: after Hala sharpens this turn, the first attack gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.activate(halaBladesaintOfTheVow);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: zenithBlade.canonicalId,
      entityTargets: "minimum",
      ordering: "listed",
      optionalBoolean: false,
    });

    Hala.activateAttack(zenithBlade);

    expectCombat(game).toHaveKeyword("go-again");
  });
});
