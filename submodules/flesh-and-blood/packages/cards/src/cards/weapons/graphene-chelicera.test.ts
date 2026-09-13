import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { grapheneChelicera } from "./graphene-chelicera.ts";

/**
 * Graphene Chelicera (GEM008) — Assassin Token Weapon - Dagger (1H), 1{p}.
 *
 * Printed:
 *   Stealth
 *   Once per Turn Action - {r}: Attack
 *   When this attacks a marked hero, the attack gets go again.
 */

describe("Graphene Chelicera (GEM008) AAA", () => {
  it("happy: attacking a marked hero grants the attack go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [grapheneChelicera],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, marked: true, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.activateAttack(grapheneChelicera);
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(19);
    expectFabPlayer(Arakni).toHaveAP(1);
  });

  it("boundary: attacking an unmarked hero does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [grapheneChelicera],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.activateAttack(grapheneChelicera);
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(19);
    expectFabPlayer(Arakni).toHaveAP(0);
  });
});
