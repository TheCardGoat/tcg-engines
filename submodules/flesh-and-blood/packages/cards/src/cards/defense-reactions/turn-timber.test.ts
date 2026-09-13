import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhimGrandfatherOfEternity } from "../heroes/oldhim-grandfather-of-eternity.ts";
import { cranialCrushBlue } from "../actions/cranial-crush.ts";
import { snatchRed } from "../actions/snatch.ts";
import { weaveEarthRed } from "../actions/weave-earth.ts";
import { turnTimberRed } from "./turn-timber.ts";

/**
 * Turn Timber (ELE010) — "Earth Fusion. If Turn Timber was fused, it gains
 * +2{d}."
 *
 * Mode B (fab-rules): CR 8.3.17 — fusion reveals an Earth card from hand as
 * an additional cost; `has-status: fused` reads the play-object declaration
 * fact and the continuous static adds +2{d} to the defense reaction.
 *
 * Fused +2{d} applies while this Defense Reaction defends (CR 1.7.4a /
 * combat-chain self-static admission).
 */

describe("Turn Timber family AAA", () => {
  it("happy: unfused defense reaction blocks 6 of an 8{p} attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cranialCrushBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: oldhimGrandfatherOfEternity,
        life: 20,
        hand: [turnTimberRed],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Dash.attackWith(cranialCrushBlue);
    game.toReaction("defender");
    Oldhim.play(turnTimberRed); // not fused: printed 6{d}
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Oldhim).toHaveLife(18); // 20 - (8 - 6)
    expectFabCard(Oldhim, turnTimberRed).toBeIn("graveyard");
  });

  it("happy: fused defense reaction blocks 8 of an 8{p} attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cranialCrushBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: oldhimGrandfatherOfEternity,
        life: 20,
        hand: [turnTimberRed, weaveEarthRed],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Dash.attackWith(cranialCrushBlue);
    game.toReaction("defender");
    Oldhim.play(turnTimberRed, { fuse: true, fuseCards: [weaveEarthRed] });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Oldhim).toHaveLife(20); // 20 - (8 - 8)
    expectFabCard(Oldhim, weaveEarthRed).toBeIn("hand");
  });

  it("boundary: a fusion declaration without an Earth card is rejected before the play", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cranialCrushBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: oldhimGrandfatherOfEternity,
        life: 20,
        hand: [turnTimberRed, snatchRed],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Dash.attackWith(cranialCrushBlue);
    game.toReaction("defender");

    expectFabUnplayable(
      () => Oldhim.play(turnTimberRed, { fuse: true, fuseCards: [snatchRed] }),
      /fusion element/i,
    );
    expectFabCard(Oldhim, turnTimberRed).toBeIn("hand");
    expectFabCard(Oldhim, snatchRed).toBeIn("hand");
  });
});
