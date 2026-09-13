import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { bravo } from "./bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { groundbreakerCrix } from "./groundbreaker-crix.ts";

/**
 * Groundbreaker Crix (SMP004) — Guardian Hero, Pit-Fighter, 20{h}/4{i}.
 *
 * Printed: Your attacks get +1{p} while attacking a hero who controls a Seismic
 * Surge token. Whenever you attack a Guardian hero, clash with them. The winner
 * creates a Seismic Surge token.
 *
 * 1v1 clash/surge is in product scope (not event-deck/party).
 */

describe("Groundbreaker Crix (SMP004) AAA", () => {
  it("happy: attacking a hero with Seismic Surge is +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: groundbreakerCrix,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arena: [fabToken("seismic-surge")],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Crix = game.as(groundbreakerCrix);

    Crix.playAttack(snatchRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: without a defending Seismic Surge Snatch stays 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: groundbreakerCrix,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Crix = game.as(groundbreakerCrix);

    Crix.playAttack(snatchRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: attacking a Guardian clashes and the winner gets Seismic Surge", () => {
    const game = FabTestEngine.start(
      {
        hero: groundbreakerCrix,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue, snatchRed],
      },
      {
        hero: bravo,
        hand: [],
        life: 20,
        deck: [snatchRed, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Crix = game.as(groundbreakerCrix);

    Crix.playAttack(snatchRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveClashWinner(Crix);
    expectFabPlayer(Crix).toHaveTokenCount("seismic-surge", 1);
  });
});
