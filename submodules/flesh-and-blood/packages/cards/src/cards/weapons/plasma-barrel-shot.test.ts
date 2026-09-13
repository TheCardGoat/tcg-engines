import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { plasmaBarrelShot } from "./plasma-barrel-shot.ts";

/**
 * Plasma Barrel Shot (CRU101) — Mechanologist Weapon Gun 2H.
 *
 * Printed:
 *   Once per Turn Action - Remove a steam counter from Plasma Barrel Shot: Attack
 *   Action - {r}{r}: If there are no steam counters on it, put a steam counter on it. Go again
 *   X is equal to 1 plus the number of times you have boosted this combat chain.
 *
 * Pin: authored power is omitted; X is not applied, so the chain opens at 0{p}.
 */

describe("Plasma Barrel Shot (CRU101) AAA", () => {
  it("boundary: without a steam counter the Attack ability is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [plasmaBarrelShot],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game
      .as(dash)
      .expectActivationRejected(
        plasmaBarrelShot,
        "KPMtkfh8Dd6Dt9LJjGQLw:oncePerTurnActionRemoveSteamCounterPlasmaBarrelShotAttack",
      );
    expectCombat(game).toBeClosed();
  });

  it("timing: once-per-turn Attack is rejected after the steam Attack resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [{ card: plasmaBarrelShot, state: { steamCounters: 2 } }],
        hand: [],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activateAttack(plasmaBarrelShot);
    game.closeCombat({ optionals: "decline" });
    Dash.expectActivationRejected(
      plasmaBarrelShot,
      "KPMtkfh8Dd6Dt9LJjGQLw:oncePerTurnActionRemoveSteamCounterPlasmaBarrelShotAttack",
    );
  });
});
