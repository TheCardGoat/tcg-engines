import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iraCrimsonHaze } from "../heroes/ira-crimson-haze.ts";
import { edgeOfAutumn } from "./edge-of-autumn.ts";

/**
 * Edge of Autumn (IRA002) — Ninja Weapon Sword 2H, power 1.
 *
 * Printed: Once per Turn Action - {r}: Attack. Go again
 */

describe("Edge of Autumn (IRA002) AAA", () => {
  it("happy: activateAttack opens combat at printed 1{p} with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        weapon1: [edgeOfAutumn],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(iraCrimsonHaze).activateAttack(edgeOfAutumn);

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(1);
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: insufficient resources cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        weapon1: [edgeOfAutumn],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(iraCrimsonHaze).expectActivationRejected(edgeOfAutumn);
    expectCombat(game).toBeClosed();
  });

  it("timing: go again refunds AP; once-per-turn still blocks a second attack", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        weapon1: [edgeOfAutumn],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.activateAttack(edgeOfAutumn);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Ira).toHaveAP(1);
    Ira.expectActivationRejected(edgeOfAutumn);
  });
});
