import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { snatchRed } from "../actions/snatch.ts";
import { crouchingTiger } from "../actions/crouching-tiger.ts";
import { tigerTamingKhakkara } from "./tiger-taming-khakkara.ts";

/**
 * Tiger Taming Khakkara (LGS292) — Ninja Weapon - Staff (2H), 2{p}.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: Attack. Go again
 *   When this attacks, the next Crouching Tiger you play this combat chain
 *   gets +1{p}.
 */

describe("Tiger Taming Khakkara (LGS292) AAA", () => {
  it("happy: a Crouching Tiger played on the same combat chain gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        weapon1: [tigerTamingKhakkara],
        hand: [crouchingTiger],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.activateAttack(tigerTamingKhakkara);
    game.advanceUntil({ stopAt: "resolution", ordering: "listed" });

    // The staff hit for 2; the chain is still open for the tiger link.
    expectFabPlayer(game.as(dash)).toHaveLife(18);

    Katsu.playAttack(crouchingTiger);
    expectCombat(game).toHaveAttackPower(1);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabPlayer(Katsu).toHaveAP(1);
  });

  it("boundary: other attacks on the chain are not buffed by the staff", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        weapon1: [tigerTamingKhakkara],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.activateAttack(tigerTamingKhakkara);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Katsu).toHaveAP(1);

    Katsu.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
  });

  it("timing: once the chain closes, a later Crouching Tiger gets no +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        weapon1: [tigerTamingKhakkara],
        hand: [crouchingTiger],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.activateAttack(tigerTamingKhakkara);
    game.helpers.resolveRestOfCombat();

    Katsu.playAttack(crouchingTiger);
    expectCombat(game).toHaveAttackPower(0);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
  });
});
