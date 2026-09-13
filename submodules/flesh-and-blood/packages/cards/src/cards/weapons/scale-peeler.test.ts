import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { ironrotPlate } from "../equipment/ironrot-plate.ts";
import { scalePeeler } from "./scale-peeler.ts";

/**
 * Scale Peeler (OUT009) — Assassin Weapon - Dagger (1H), 1{p}, Piercing 1.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: Attack. Go again
 *   Piercing 1
 *   When this hits a hero, the next time they defend with 1 or more equipment
 *   this turn, those equipment get -1{d} while defending.
 */

describe("Scale Peeler (OUT009) AAA", () => {
  it("happy: after the hit, defending equipment gets -1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [scalePeeler],
        hand: [snatchRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, chest: [ironrotPlate], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.activateAttack(scalePeeler);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(19);

    Arakni.playAttack(snatchRed);
    Dash.defendWith(ironrotPlate);
    game.passBoth();

    expectFabCard(Dash, ironrotPlate).toHaveDefense(0);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    // 4 − (1{d} − 1)
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: an action card defending is not debuffed", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [scalePeeler],
        hand: [snatchRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.activateAttack(scalePeeler);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(19);

    Arakni.playAttack(snatchRed);
    Dash.defendWith(nimblismBlue);
    game.passBoth();

    expectFabCard(Dash, nimblismBlue).toHaveDefense(2);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    // 4 − 2{d}
    expectFabPlayer(Dash).toHaveLife(17);
  });
});
