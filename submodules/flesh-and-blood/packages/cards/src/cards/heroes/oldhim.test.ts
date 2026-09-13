import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FabTestEngine,
  FAB_MANUAL_HARNESS,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { oldhim } from "./oldhim.ts";
import { winterSWail } from "../weapons/winter-s-wail.ts";
import { weaveEarthBlue } from "../actions/weave-earth.ts";
import { blizzardBlue } from "../instants/blizzard.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Oldhim (ELE002) — Elemental Guardian Hero — Young.
 *
 * Printed: "Essence of Earth and Ice / Once per Turn Defense Reaction -
 * {r}{r}{r}: If an Earth card is pitched this way, prevent the next 2 damage
 * that would be dealt to you this turn. If an Ice card is pitched this way,
 * the attacking hero puts a card from their hand on top of their deck."
 *
 * Signature weapon: Winter's Wail (ELE003).
 *
 * Pattern mirrors oldhim-grandfather-of-eternity.test.ts (adult) with young stats.
 */

const opponentHero = dash;

describe("oldhim (ELE002) AAA", () => {
  it("core mechanic: pitching an Earth card prevents the next 2 damage this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [weaveEarthBlue],
        resourcePoints: 0,
        life: 20,
        deck: 6,
      },
      { hero: opponentHero, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: opponentHero },
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(opponentHero);

    // Dash attacks with 4{p}; Oldhim declines blocking and pays {r}{r}{r} by
    // pitching his only hand card — the Earth card — during the reaction step.
    Dash.playAttack(snatchRed);
    Oldhim.defendWith();
    game.toReaction("defender");
    Oldhim.activate(oldhim);
    Oldhim.pitchFirst();
    game.closeCombat({ optionals: "decline" });

    // 4{p} − 2 prevented = 2 damage.
    expectFabPlayer(Oldhim).toHaveLife(18);
    expectCombat(game).toBeClosed();
  });

  it("core mechanic: pitching an Ice card puts an attacking-hero card on top of their deck", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [blizzardBlue],
        resourcePoints: 0,
        life: 20,
        deck: 6,
      },
      { hero: opponentHero, hand: [snatchRed, snatchRed], actionPoints: 1, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: opponentHero },
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(opponentHero);

    Dash.playAttack(snatchRed);
    Oldhim.defendWith();
    game.toReaction("defender");
    Oldhim.activate(oldhim);
    Oldhim.pitchFirst();
    game.untilIdle({ entityTargets: "minimum", optionals: "decline" });

    // No prevention: full 4 damage, but one Dash card moved hand → deck top.
    expectFabPlayer(Oldhim).toHaveLife(16);
    expectFabPlayer(Dash).toHaveHandCount(1);
  });

  it("boundary: the defense reaction is illegal outside combat", () => {
    const game = FabTestEngine.start(
      { hero: oldhim, hand: [weaveEarthBlue], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: opponentHero, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.expectActivationRejected(oldhim);
  });

  it("signature weapon: Winter's Wail (ELE003) attacks at 4{p} for {r}{r}{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        weapon1: [winterSWail],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Oldhim = game.as(oldhim);

    Oldhim.activate(winterSWail);
    game.passBoth();

    expectFabPlayer(Oldhim).toHaveResourceCount(0);
    expectCombat(game).toBeOpen().toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(opponentHero)).toHaveLife(16);
  });
});
