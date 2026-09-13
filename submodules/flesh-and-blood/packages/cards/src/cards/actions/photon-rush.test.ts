import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../heroes/briar.ts";
import { dash } from "../heroes/dash.ts";
import { cosmicFlareRed } from "../instants/cosmic-flare.ts";
import { snatchRed } from "./snatch.ts";
import { photonRushBlue } from "./photon-rush.ts";
import { photonRushRed } from "./photon-rush.ts";

/**
 * Photon Rush, Blue (AUR024) — Lightning Flow conditional go again
 * (W2-FIX2 removed the unprinted module `goAgain`; CRU151-class fix).
 *
 * Printed: "Lightning Flow - If you've played a Lightning card this
 * turn, this gets go again" — go again is Lightning-conditional only and
 * is granted by the resolution ability. Proven in both directions: the
 * action point refunds after a Lightning card this turn and does not
 * refund without one.
 */

describe("Photon Rush (AUR024) AAA", () => {
  it("playline: after a Lightning card this turn, the rush refunds its action point", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [cosmicFlareRed, photonRushBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    // Cosmic Flare (cost-0 Lightning instant, gain {r}{r}{r}) counts as
    // the Lightning card played this turn.
    Briar.play(cosmicFlareRed);
    game.helpers.resolveUntilIdle();

    Briar.playAttack(photonRushBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(19);
    // the conditional go again refunds the attack's action point.
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: no Lightning card played this turn — the action point is not refunded", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [photonRushBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(photonRushBlue);
    game.helpers.resolveRestOfCombat();

    // Printed go again is Lightning-conditional: with no Lightning card
    // played this turn, the spent action point stays spent.
    expectFabPlayer(Briar).toHaveAP(0);
  });

  it("boundary: 1{p} attack; defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [photonRushBlue, photonRushBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    // Dash's turn: 4{p} Snatch into a 3{d} block leaves 1 damage.
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Briar.defendWith([photonRushBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Briar).toHaveLife(19);

    Dash.endTurn();
    game.helpers.untilIdle();

    Briar.playAttack(photonRushBlue);
    expectCombat(game).toHaveAttackPower(1);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(19);
    expect(Briar.zone("graveyard")).toContain(photonRushBlue.canonicalId);
  });
});

/**
 * Photon Rush, Red (AUR011) — Lightning Flow conditional go again
 * (W2-FIX2 removed the unprinted module `goAgain`; CRU151-class fix).
 *
 * Printed: "Lightning Flow - If you've played a Lightning card this
 * turn, this gets go again" — go again is Lightning-conditional only and
 * is granted by the resolution ability. Proven in both directions: the
 * action point refunds after a Lightning card this turn and does not
 * refund without one.
 */

describe("Photon Rush (AUR011) AAA", () => {
  it("playline: after a Lightning card this turn, the rush refunds its action point", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [cosmicFlareRed, photonRushRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    // Cosmic Flare (cost-0 Lightning instant, gain {r}{r}{r}) counts as
    // the Lightning card played this turn.
    Briar.play(cosmicFlareRed);
    game.helpers.resolveUntilIdle();

    Briar.playAttack(photonRushRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    // the conditional go again refunds the attack's action point.
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: no Lightning card played this turn — the action point is not refunded", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [photonRushRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(photonRushRed);
    game.helpers.resolveRestOfCombat();

    // Printed go again is Lightning-conditional: with no Lightning card
    // played this turn, the spent action point stays spent.
    expectFabPlayer(Briar).toHaveAP(0);
  });

  it("boundary: 3{p} attack; defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [photonRushRed, photonRushRed],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    // Dash's turn: 4{p} Snatch into a 3{d} block leaves 1 damage.
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Briar.defendWith([photonRushRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Briar).toHaveLife(19);

    Dash.endTurn();
    game.helpers.untilIdle();

    Briar.playAttack(photonRushRed);
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(17);
    expect(Briar.zone("graveyard")).toContain(photonRushRed.canonicalId);
  });
});
