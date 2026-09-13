import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromai } from "../heroes/dromai.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { sweepingBlowRed } from "./sweeping-blow.ts";

/**
 * Sweeping Blow (DRO017) — Draconic Illusionist Action - Attack, cost 1, 3{p}/3{d}.
 *
 * Printed: "When you attack with Sweeping Blow, create an Ash token. Go again"
 */

describe("Sweeping Blow (DRO017) AAA", () => {
  it("happy: attacking creates an Ash token under the controller", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [sweepingBlowRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.playAttack(sweepingBlowRed);

    expectFabPlayer(Dromai).toHaveTokenCount("ash", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("ash", 0);
    expectCombat(game).toHaveAttackPower(3).toHaveKeyword("go-again");
  });

  it("boundary: a different attack does not mint Sweeping Blow's Ash", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.playAttack(brutalAssaultBlue);

    expectFabPlayer(Dromai).toHaveTokenCount("ash", 0);
  });

  it("timing: Ash exists at attack declaration; go again refunds AP after the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [sweepingBlowRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.playAttack(sweepingBlowRed);
    expectFabPlayer(Dromai).toHaveTokenCount("ash", 1);
    expectCombat(game).toBeOpen();

    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Dromai).toHaveTokenCount("ash", 1);
    expectFabPlayer(Dromai).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });
});
