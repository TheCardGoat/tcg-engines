import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { breachFleshRed } from "./breach-flesh.ts";

/**
 * Breach Flesh, Red — Shadow Action - Attack, cost 0, 4{p}.
 *
 * Printed: "When this hits, create a Gate to i'Arathael token.\nBlood Debt"
 */

describe("Breach Flesh AAA", () => {
  it("happy: a hit creates a Gate to i'Arathael", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [breachFleshRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(breachFleshRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Chane).toHaveTokenCount("gate-to-i-arathael", 1);
  });

  it("boundary: a fully defended miss creates no Gate", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [breachFleshRed],
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
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.playAttack(breachFleshRed);
    expectCombat(game).toHaveAttackPower(4);
    Dash.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Chane).toHaveTokenCount("gate-to-i-arathael", 0);
  });
});
