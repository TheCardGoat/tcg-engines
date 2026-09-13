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
import { disableRed } from "../actions/disable.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { valdaBrightaxe } from "./valda-brightaxe.ts";

/**
 * Valda Brightaxe (EVR019) — Guardian Hero — Young — 21hp.
 *
 * Printed: "Whenever an opponent draws 1 or more cards during an action phase,
 * create that many Seismic Surge tokens. / At the start of your turn, if you
 * control 3 or more Seismic Surge tokens, cards you own with crush get
 * dominate this turn."
 *
 * Pattern mirrors valda-seismic-impact.test.ts (adult MPG001).
 */

const hero = valdaBrightaxe;
const opponentHero = dash;

describe("valda-brightaxe (EVR019) AAA", () => {
  it("happy: an opposing action-phase draw creates that many Seismic Surge tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: opponentHero,
        hand: [tomeOfFyendalYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Opponent = game.as(opponentHero);

    // Tome of Fyendal draws 2 — Valda creates that many Surge tokens.
    Opponent.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle();

    expectFabToken(game, "seismic-surge").toHaveCount(2).toBeIn("arena");
  });

  it("happy: with 3+ Seismic Surges at the start of turn, crush attacks get dominate", () => {
    const game = FabTestEngine.start(
      { hero: opponentHero, hand: [], deck: 6 },
      {
        hero,
        hand: [disableRed, nimblismBlue, nimblismBlue],
        arena: [seismicSurge, seismicSurge, seismicSurge],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Opponent = game.as(opponentHero);
    const Valda = game.as(hero);

    Opponent.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    Valda.must.pitch(nimblismBlue, nimblismBlue).playAttack(disableRed);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveKeyword("dominate");
    game.closeCombat({ optionals: "decline" });
  });

  it("boundary: with 3+ Seismic Surges the dominate grant still must not land on non-crush cards", () => {
    const game = FabTestEngine.start(
      {
        hero,
        hand: [disableRed, snatchRed],
        arena: [seismicSurge, seismicSurge, seismicSurge],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: opponentHero, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Valda = game.as(hero);

    Valda.playAttack(snatchRed);
    game.passBoth();

    expectCombat(game).toBeOpen().notToHaveKeyword("dominate");
    game.closeCombat({ optionals: "decline" });
  });

  it("boundary: a non-crush attack does not gain dominate", () => {
    const game = FabTestEngine.start(
      {
        hero,
        hand: [snatchRed],
        arena: [seismicSurge, seismicSurge, seismicSurge],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Valda = game.as(hero);

    Valda.playAttack(snatchRed);
    game.passBoth();

    expectCombat(game).toBeOpen().notToHaveKeyword("dominate");
    game.closeCombat({ optionals: "decline" });
  });

  it("boundary: with fewer than 3 Seismic Surges, crush cards stay without dominate", () => {
    const game = FabTestEngine.start(
      {
        hero,
        hand: [disableRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Valda = game.as(hero);

    Valda.playAttack(disableRed);
    game.passBoth();

    expectCombat(game).toBeOpen().notToHaveKeyword("dominate");
    game.closeCombat({ optionals: "decline" });
  });
});
