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
import { corporealChasmRed } from "./corporeal-chasm.ts";

/**
 * Corporeal Chasm, Red — Shadow Action - Attack, cost 3, 7{p}.
 *
 * Printed: "When this hits, create a Gate to i'Arathael token.\nBlood Debt"
 */

describe("Corporeal Chasm AAA", () => {
  it("happy: a hit creates a Gate to i'Arathael", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [corporealChasmRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(corporealChasmRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabPlayer(Chane).toHaveTokenCount("gate-to-i-arathael", 1);
  });

  it("boundary: a fully defended miss creates no Gate", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [corporealChasmRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.playAttack(corporealChasmRed);
    expectCombat(game).toHaveAttackPower(7);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Chane).toHaveTokenCount("gate-to-i-arathael", 0);
  });
});
