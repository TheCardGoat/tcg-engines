import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { fyendalSSpringTunic } from "../equipment/fyendal-s-spring-tunic.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { drillShotRed } from "./drill-shot.ts";

/**
 * Drill Shot, Red (DYN156) — Ranger Arrow Attack, cost 0, 4{p}.
 * Printed: If Drill Shot has an aim counter, it has piercing 1.
 * When this hits a hero, put a -1{d} counter on an equipment they control.
 */

describe("Drill Shot (DYN156) AAA", () => {
  it("happy: an aim counter grants piercing 1", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: drillShotRed, state: { aimCounters: 1, faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, chest: [fyendalSSpringTunic], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(azalea).attackWith(drillShotRed, { from: "arsenal" });
    expectCombat(game).toHaveKeyword("piercing");
  });

  it("boundary: without an aim counter the arrow does not have piercing", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: drillShotRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, chest: [fyendalSSpringTunic], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(azalea).attackWith(drillShotRed, { from: "arsenal" });
    expectCombat(game).notToHaveKeyword("piercing");
  });

  it("timing: a hit puts a -1{d} counter on the defending hero's equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: drillShotRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, chest: [fyendalSSpringTunic], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(azalea).attackWith(drillShotRed, { from: "arsenal" });
    game.closeCombat({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, fyendalSSpringTunic).toHaveDefenseCounters(-1);
  });

  it("timing: a miss does not put a -1{d} counter on equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: drillShotRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        chest: [fyendalSSpringTunic],
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(azalea).attackWith(drillShotRed, { from: "arsenal" });
    Dash.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, fyendalSSpringTunic).toHaveDefenseCounters(0);
  });
});
