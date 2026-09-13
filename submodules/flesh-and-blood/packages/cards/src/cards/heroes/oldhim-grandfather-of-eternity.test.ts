import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FabTestEngine,
  FAB_MANUAL_HARNESS,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { oldhimGrandfatherOfEternity } from "./oldhim-grandfather-of-eternity.ts";
import { winterSWail } from "../weapons/winter-s-wail.ts";
import { weaveEarthBlue } from "../actions/weave-earth.ts";
import { blizzardBlue } from "../instants/blizzard.ts";
import { disableRed } from "../actions/disable.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Oldhim, Grandfather of Eternity (ELE001) — Elemental Guardian Hero — 40hp.
 *
 * Printed: "Essence of Earth and Ice / Once per Turn Defense Reaction -
 * {r}{r}{r}: If an Earth card is pitched this way, prevent the next 2 damage
 * that would be dealt to you this turn. If an Ice card is pitched this way,
 * the attacking hero puts a card from their hand on top of their deck."
 *
 * Signature weapon: Winter's Wail (ELE003).
 *
 * Pattern mirrors oldhim.test.ts (young ELE002) with adult stats.
 */

const opponentHero = dash;

describe("oldhim-grandfather-of-eternity (ELE001) AAA", () => {
  it("core mechanic: pitching an Earth card prevents the next 2 damage this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [weaveEarthBlue],
        resourcePoints: 0,
        life: 40,
        deck: 6,
      },
      { hero: opponentHero, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: opponentHero },
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);
    const Dash = game.as(opponentHero);

    Dash.playAttack(snatchRed);
    Oldhim.defendWith();
    game.toReaction("defender");
    Oldhim.activate(oldhimGrandfatherOfEternity);
    Oldhim.pitchFirst(); // the only hand card — the Earth card
    game.closeCombat({ optionals: "decline" });

    // 4{p} − 2 prevented = 2 damage.
    expectFabPlayer(Oldhim).toHaveLife(38);
    expectCombat(game).toBeClosed();
  });

  it("core mechanic: pitching an Ice card puts an attacking-hero card on top of their deck", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [blizzardBlue],
        resourcePoints: 0,
        life: 40,
        deck: 6,
      },
      { hero: opponentHero, hand: [snatchRed, snatchRed], actionPoints: 1, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: opponentHero },
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);
    const Dash = game.as(opponentHero);

    Dash.playAttack(snatchRed);
    Oldhim.defendWith();
    game.toReaction("defender");
    Oldhim.activate(oldhimGrandfatherOfEternity);
    Oldhim.pitchFirst(); // the only hand card — the Ice card
    game.untilIdle({ entityTargets: "minimum", optionals: "decline" });

    // No prevention: full 4 damage, but one Dash card moved hand → deck top.
    expectFabPlayer(Oldhim).toHaveLife(36);
    expectFabPlayer(Dash).toHaveHandCount(1);
  });

  it("boundary: the defense reaction is illegal outside combat", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [disableRed],
        deck: 6,
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hero: opponentHero, life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Oldhim.expectActivationRejected(oldhimGrandfatherOfEternity);
  });

  it("boundary: the defense reaction is illegal while Oldhim is the attacker", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [disableRed],
        deck: 6,
        resourcePoints: 5,
        actionPoints: 1,
      },
      { hero: opponentHero, life: 40, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: oldhimGrandfatherOfEternity },
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    // Open combat as attacker (disable is a 5{r} Guardian attack) — the DR is
    // still not legal during his own attack.
    Oldhim.playAttack(disableRed);
    game.passBoth();

    Oldhim.expectActivationRejected(oldhimGrandfatherOfEternity);
    expectCombat(game).toBeOpen();
    game.closeCombat({ optionals: "decline" });
  });

  it("boundary: once per turn — a second pitch is illegal on the same turn", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [weaveEarthBlue, blizzardBlue],
        resourcePoints: 0,
        life: 40,
        deck: 6,
      },
      { hero: opponentHero, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: opponentHero },
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);
    const Dash = game.as(opponentHero);

    Dash.playAttack(snatchRed);
    Oldhim.defendWith();
    game.toReaction("defender");
    // Pitch the Earth card (the first payment candidate) for the first activation.
    Oldhim.activate(oldhimGrandfatherOfEternity);
    Oldhim.pitchFirst();
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Oldhim).toHaveLife(38);

    // Second attack the same turn — no activation left.
    Dash.playAttack(snatchRed);
    Oldhim.defendWith();
    game.toReaction("defender");
    Oldhim.expectActivationRejected(oldhimGrandfatherOfEternity);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Oldhim).toHaveLife(34);
  });

  it("signature weapon: Winter's Wail (ELE003) attacks at 4{p} for {r}{r}{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        weapon1: [winterSWail],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Oldhim.activate(winterSWail);
    game.passBoth();

    expectFabPlayer(Oldhim).toHaveResourceCount(0);
    expectCombat(game).toBeOpen().toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(opponentHero)).toHaveLife(36);
  });
});
