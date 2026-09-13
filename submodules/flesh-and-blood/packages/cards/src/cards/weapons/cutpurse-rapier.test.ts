import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { browbeatBlue } from "../actions/browbeat.ts";
import { cutpurseRapier } from "./cutpurse-rapier.ts";

/**
 * Cutpurse Rapier (SPW002) — Warrior Thief Weapon - Sword (2H), 3{p}.
 *
 * Printed:
 *   Once per Turn Action - {r}: Attack
 *   When this hits a hero, steal a Gold token they control.
 */

describe("Cutpurse Rapier (SPW002) AAA", () => {
  it("happy: on hit, a Gold token is stolen from the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [cutpurseRapier],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, arena: [fabToken("gold")], deck: 6 },
    );
    const Dori = game.as(dorinthea);

    Dori.activateAttack(cutpurseRapier);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dori).toHaveTokenCount("gold", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("gold", 0);
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("boundary: the attack is defended, so the Gold is not stolen", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [cutpurseRapier],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [browbeatBlue],
        life: 20,
        arena: [fabToken("gold")],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.activateAttack(cutpurseRapier);
    game.as(dash).defendWith(browbeatBlue);
    game.passBoth();

    expectFabPlayer(Dori).toHaveTokenCount("gold", 0);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("gold", 1);
  });
});
