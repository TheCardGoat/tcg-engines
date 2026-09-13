import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { redLiner } from "../weapons/red-liner.ts";
import { headShotBlue } from "../actions/head-shot.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { longdrawHalfGlove } from "./longdraw-half-glove.ts";

/**
 * Longdraw Half-glove — Ranger Arms d1 Battleworn.
 *
 * Printed: "Instant - Destroy this, put 2 cards from your hand and/or arsenal
 * on the bottom of your deck: Your next arrow attack this turn gets +4{p}.
 * Battleworn"
 */

describe("Longdraw Half-glove AAA", () => {
  it("happy: the cost moves 2 cards to the deck bottom and the next arrow attack gets +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arms: [longdrawHalfGlove],
        weapon1: [redLiner],
        arsenal: [headShotBlue],
        hand: [nimblismBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(longdrawHalfGlove);
    // Pay the sink-2 cost from the two unique hand cards (head-shot stays).
    Azalea.target(nimblismBlue, snatchRed);
    game.passBoth(); // resolve the Instant layer: destroy-self

    expectFabCard(Azalea, longdrawHalfGlove).toBeIn("graveyard");
    expectFabCard(Azalea, Azalea.cardIn("deck", nimblismBlue)).toBeIn("deck");
    expectFabCard(Azalea, Azalea.cardIn("deck", snatchRed)).toBeIn("deck");

    Azalea.playAttack(headShotBlue, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(6); // 2 base + 4
    game.closeCombat({ ordering: "listed" });
  });

  it("boundary: with fewer than 2 cards to sink, the Instant cannot be activated", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arms: [longdrawHalfGlove],
        weapon1: [redLiner],
        hand: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.expectActivationRejected(longdrawHalfGlove);
    expectFabCard(Azalea, longdrawHalfGlove).toBeIn("arms");
  });
});
