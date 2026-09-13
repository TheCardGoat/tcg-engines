import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { malice } from "../heroes/malice.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { voxNecropolis } from "../weapons/vox-necropolis.ts";
import { restlessSteedRed } from "./restless-steed.ts";

/**
 * Restless Steed, Red — Shadow Necromancer Action - Zombie Ally, 3{p}, Decay.
 *
 * Printed: "When this hits, the attack gets go again.\nDecay"
 */

describe("Restless Steed AAA", () => {
  it("happy: a hit grants go again to the steed's attack", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [restlessSteedRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.activateAttack(restlessSteedRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabPlayer(Malice).toHaveAP(1);
  });

  it("boundary: a miss does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [restlessSteedRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    Malice.activateAttack(restlessSteedRed);
    expectCombat(game).toHaveAttackPower(3);
    Dash.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Malice).toHaveAP(0);
  });
});
