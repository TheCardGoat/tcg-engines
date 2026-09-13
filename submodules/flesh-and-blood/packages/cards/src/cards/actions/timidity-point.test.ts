import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";

import { snatchRed } from "./snatch.ts";
import { timidityPointRed } from "./timidity-point.ts";

/**
 * Timidity Point (EVR097) — Ranger Arrow. Red cost 1, 5{p}/3{d}.
 * When this hits a hero, attacks they control lose and can't gain dominate during their next turn.
 */

describe("Timidity Point (EVR097) AAA", () => {
  it("happy: hit deals printed damage", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: timidityPointRed, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(timidityPointRed, { from: "arsenal" });
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: a blocked miss does not apply the next-turn dominate restrict", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: timidityPointRed, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(timidityPointRed, { from: "arsenal" });
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: attacks they control cannot have dominate on their next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: timidityPointRed, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(timidityPointRed, { from: "arsenal" });
    game.closeCombat();
    Azalea.endTurn();

    Dash.playAttack(snatchRed);
    expectCombat(game).notToHaveKeyword("dominate");
  });
});
