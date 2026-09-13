import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { infectYellow } from "../actions/infect.ts";
import { humourPlunge } from "./humour-plunge.ts";

/**
 * Humour Plunge (AMO002) — Assassin Weapon - Dagger (1H), 1{p}, Piercing 1.
 *
 * Printed:
 *   Action - {r}{r}, {t}: Attack. Go again
 *   If this is attacking an infected hero, this gets +1{p}.
 *   Piercing 1
 */

describe("Humour Plunge (AMO002) AAA", () => {
  it("happy: attacking a hero that controls a Disease gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [humourPlunge],
        hand: [infectYellow],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    // Infect hits and leaves a Bloodrot Pox (Disease) under the defender's control.
    Arakni.playAttack(infectYellow);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    Arakni.activateAttack(humourPlunge);
    expectCombat(game).toHaveAttackPower(2);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: attacking a hero without a Disease swings at printed 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [humourPlunge],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.activateAttack(humourPlunge);
    expectCombat(game).toHaveAttackPower(1);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(19);
    expectFabPlayer(Arakni).toHaveAP(1);
  });
});
