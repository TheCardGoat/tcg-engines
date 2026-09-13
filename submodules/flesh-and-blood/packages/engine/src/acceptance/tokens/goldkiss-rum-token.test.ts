/**
 * SEA245 Goldkiss Rum — Generic Token Item.
 *
 * Printed:
 *   a1: Instant - {t} your hero, destroy this: Your next action this turn
 *       gets go again. Your hero can't {u} this turn unless they're a Pirate.
 *
 * Status: ✅ — activation costs, next-Action go again, typed untap
 * restriction, Pirate exception, duration, repeated sources, and snapshot
 * restoration are proven through public play.
 */
import { describe, expect, it } from "vitest";

import { perkUpRed } from "../../../../cards/src/cards/actions/perk-up.ts";
import { scurvStowaway } from "../../../../cards/src/cards/heroes/scurv-stowaway.ts";
import { goldkissRum } from "../../../../cards/src/cards/tokens/goldkiss-rum.ts";
import {
  createFabMatchContext,
  expectFabCard,
  FabTestEngine,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../../index.ts";
import { bravo, crackedBaubleYellow, dash, nimblismBlue, snatchRed } from "../../rules/fixtures.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

function restore(game: FabTestEngine): FabTestEngine {
  const state = game.getState();
  return FabTestEngine.fromState(
    restoreFabMatchSnapshot(
      serializeFabMatchSnapshot(state),
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    ),
  );
}

function startGoldkissTurn(
  hero = bravo,
  hand = [perkUpRed, nimblismBlue, snatchRed, crackedBaubleYellow],
  assets: { readonly actionPoints: number; readonly resourcePoints: number } = {
    actionPoints: 2,
    resourcePoints: 3,
  },
) {
  return FabTestEngine.start(
    {
      hero,
      arena: [goldkissRum],
      hand,
      arsenal: [snatchRed],
      deck: 8,
      ...assets,
    },
    { hero: dash, hand: [], deck: 8 },
    manual,
  );
}

function resolvePerkUpUntap(game: FabTestEngine, hero = bravo, pitch?: typeof nimblismBlue): void {
  const player = game.as(hero);
  player.play(perkUpRed, pitch ? { pitch } : undefined);
  game.passBoth();
  player.chooseBoolean(true);
  game.helpers.resolveUntilIdle();
}

describe("Goldkiss Rum token (SEA245)", () => {
  it("card loads in arena", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [goldkissRum], deck: 8 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("arena")).toContain(goldkissRum.canonicalId);
  });

  it("a1: taps the hero, destroys itself, and gives the next action go again", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [goldkissRum], hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(goldkissRum);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, bravo).toBeTapped();
    expect(Bravo.zone("arena")).not.toContain(goldkissRum.canonicalId);

    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expect(game.as(dash).life()).toBe(16);
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("a1: a non-Pirate hero cannot be untapped by repeated card effects this turn", () => {
    const game = startGoldkissTurn(bravo, [
      perkUpRed,
      perkUpRed,
      nimblismBlue,
      crackedBaubleYellow,
    ]);
    const Bravo = game.as(bravo);

    expect(Bravo.handCount()).toBe(4);
    expect(Bravo.zone("arsenal")).toEqual([snatchRed.canonicalId]);

    Bravo.activate(goldkissRum);
    game.passBoth();
    expectFabCard(Bravo, bravo).toBeTapped();

    resolvePerkUpUntap(game);
    expectFabCard(Bravo, bravo).toBeTapped();

    resolvePerkUpUntap(game);
    expectFabCard(Bravo, bravo).toBeTapped();
  });

  it("a1: the Pirate exception lets the same untap effect ready the hero", () => {
    const game = startGoldkissTurn(scurvStowaway);
    const Scurv = game.as(scurvStowaway);

    expect(Scurv.handCount()).toBe(4);
    expect(Scurv.zone("arsenal")).toEqual([snatchRed.canonicalId]);

    Scurv.activate(goldkissRum);
    game.helpers.resolveUntilIdle();
    expectFabCard(Scurv, scurvStowaway).toBeTapped();

    resolvePerkUpUntap(game, scurvStowaway);
    expectFabCard(Scurv, scurvStowaway).toBeReady();
  });

  it("a1: blocks the CR 4.4.3d end-phase untap, then expires at end of turn", () => {
    const game = startGoldkissTurn(
      bravo,
      [perkUpRed, perkUpRed, nimblismBlue, crackedBaubleYellow],
      { actionPoints: 0, resourcePoints: 0 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(goldkissRum);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    expectFabCard(Bravo, bravo).toBeTapped();

    Dash.endTurn();
    resolvePerkUpUntap(game, bravo, nimblismBlue);
    expectFabCard(Bravo, bravo).toBeReady();
  });

  it("a1: persists the exact hero restriction across snapshot restoration", () => {
    let game = startGoldkissTurn();
    let Bravo = game.as(bravo);

    Bravo.activate(goldkissRum);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, bravo).toBeTapped();

    game = restore(game);
    Bravo = game.as(bravo);
    Bravo.endTurn();
    expectFabCard(Bravo, bravo).toBeTapped();
  });
});
