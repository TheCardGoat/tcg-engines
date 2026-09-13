import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { seismicSurge } from "../tokens/seismic-surge.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { snatchRed } from "../actions/snatch.ts";
import { disableRed } from "../actions/disable.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { valdaSeismicImpact } from "./valda-seismic-impact.ts";

/**
 * Valda, Seismic Impact (MPG001) — Guardian Hero.
 *
 * Printed: Whenever an opponent draws 1 or more cards during an action phase,
 * create that many Seismic Surge tokens.
 * At the start of your turn, if you control 3 or more Seismic Surge tokens,
 * cards you own with crush get dominate this turn.
 */

describe("Valda, Seismic Impact (MPG001) AAA", () => {
  it("happy: an opposing action-phase draw creates that many Seismic Surges", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [tomeOfFyendalYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: valdaSeismicImpact, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const _Valda = game.as(valdaSeismicImpact);

    Dash.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle();

    // Tome of Fyendal draws 2 — _Valda creates that many Surge tokens.
    expectFabToken(game, "seismic-surge").toHaveCount(2).toBeIn("arena");
  });

  it("happy: with 3+ Seismic Surges at the start of turn, crush attacks get dominate", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: valdaSeismicImpact,
        hand: [disableRed, nimblismBlue, nimblismBlue],
        arena: [seismicSurge, seismicSurge, seismicSurge],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Valda = game.as(valdaSeismicImpact);

    Dash.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    Valda.must.pitch(nimblismBlue, nimblismBlue).playAttack(disableRed);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveKeyword("dominate");
    game.closeCombat({ optionals: "decline" });
  });

  it("boundary: a non-crush attack does not gain dominate from 3 Surges", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: valdaSeismicImpact,
        hand: [snatchRed],
        arena: [seismicSurge, seismicSurge, seismicSurge],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Valda = game.as(valdaSeismicImpact);

    Dash.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    Valda.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");

    expectCombat(game).notToHaveKeyword("dominate");
  });

  it("boundary: with 3+ Seismic Surges the dominate grant still must not land on non-crush cards", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: valdaSeismicImpact,
        hand: [snatchRed],
        arena: [seismicSurge, seismicSurge, seismicSurge],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Valda = game.as(valdaSeismicImpact);

    Dash.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    Valda.must.playAttack(snatchRed);
    game.passBoth();

    expectCombat(game).toBeOpen().notToHaveKeyword("dominate");
    game.closeCombat({ optionals: "decline" });
  });
});
