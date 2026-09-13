import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { numbskullCharmYellow } from "../instants/numbskull-charm.ts";
import { browbeatBlue } from "../actions/browbeat.ts";
import { celebrantBroadsword } from "./celebrant-broadsword.ts";

/**
 * Celebrant Broadsword (SPW004) — Revered Warrior Weapon - Sword (2H), 3{p}.
 *
 * Printed:
 *   Once per Turn Action - {r}: Attack
 *   If you've been cheered this turn, this card's attacks get go again.
 */

describe("Celebrant Broadsword (SPW004) AAA", () => {
  it("happy: cheered this turn, the broadsword attack gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [celebrantBroadsword],
        hand: [numbskullCharmYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(numbskullCharmYellow, { modeIndexes: [1] });
    game.passBoth();
    game.helpers.untilIdle();

    Dori.activateAttack(celebrantBroadsword);
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabPlayer(Dori).toHaveAP(1);
  });

  it("boundary: not cheered, the attack resolves without go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [celebrantBroadsword],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.activateAttack(celebrantBroadsword);
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabPlayer(Dori).toHaveAP(0);
  });

  it("timing: a previous-turn cheer does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [celebrantBroadsword],
        hand: [numbskullCharmYellow, browbeatBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.play(numbskullCharmYellow, { modeIndexes: [1] });
    game.passBoth();
    game.helpers.untilIdle();
    Dori.endTurn();
    game.helpers.untilIdle();

    Dash.endTurn();
    game.helpers.untilIdle();

    Dori.activate(celebrantBroadsword);
    game.helpers.resolveUntilIdle({
      paymentCanonicalId: browbeatBlue.canonicalId,
      optionalBoolean: false,
    });
    expectFabPlayer(Dori).toHaveAP(0);
  });
});
