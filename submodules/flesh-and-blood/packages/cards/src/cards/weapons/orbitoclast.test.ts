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
import { browbeatBlue } from "../actions/browbeat.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { orbitoclast } from "./orbitoclast.ts";

/**
 * Orbitoclast (OUT007) — Assassin Weapon - Dagger (1H), 1{p}, Piercing 1.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: Attack. Go again
 *   Piercing 1
 *   When this hits a hero, the next time they defend with 1 or more
 *   'non-attack' action cards this turn, those cards get -1{d} while defending.
 */

describe("Orbitoclast (OUT007) AAA", () => {
  it("happy: after the hit, a non-attack action defending gets -1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [orbitoclast],
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

    Arakni.activateAttack(orbitoclast);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(19);

    Arakni.playAttack(snatchRed);
    Dash.defendWith(nimblismBlue);
    game.passBoth();

    expectFabCard(Dash, nimblismBlue).toHaveDefense(1);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    // 4 − (2{d} − 1)
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: an attack action defending is not debuffed", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [orbitoclast],
        hand: [snatchRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [browbeatBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.activateAttack(orbitoclast);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(19);

    Arakni.playAttack(snatchRed);
    Dash.defendWith(browbeatBlue);
    game.passBoth();

    expectFabCard(Dash, browbeatBlue).toHaveDefense(3);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    // 4 − 3{d}
    expectFabPlayer(Dash).toHaveLife(18);
  });
});
