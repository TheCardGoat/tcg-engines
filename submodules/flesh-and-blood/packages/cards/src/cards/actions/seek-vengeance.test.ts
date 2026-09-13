import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { edgeOfAutumn } from "../weapons/edge-of-autumn.ts";
import { snatchRed } from "./snatch.ts";
import { seekVengeanceBlue } from "./seek-vengeance.ts";
import { seekVengeanceRed } from "./seek-vengeance.ts";

/**
 * Seek Vengeance, Blue (ASR022) — combo-conditional go again (W2-FIX2
 * removed the unprinted module `goAgain`; CRU151-class fix, same as the
 * red ASR012).
 *
 * Printed: "Combo - If Edge of Autumn was the last attack this combat
 * chain, this gets go again." — go again is combo-conditional only and is
 * granted by the resolution ability. Proven in both directions: the action
 * point refunds after an Edge of Autumn link and does not refund without
 * one.
 */

describe("Seek Vengeance (ASR022) AAA", () => {
  it("playline: after an Edge of Autumn attack, the combo link refunds its action point", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [seekVengeanceBlue],
        weapon1: [edgeOfAutumn],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.activate(edgeOfAutumn);
    game.advanceCombatTo("resolution");

    Fai.playAttack(seekVengeanceBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17); // 1 (sword) + 2 (Seek Vengeance)
    // the sword's and the combo link's go agains refund both spends.
    expectFabPlayer(Fai).toHaveAP(2);
  });

  it("boundary: no Edge of Autumn on the chain — the action point is not refunded", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [seekVengeanceBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(seekVengeanceBlue);
    game.helpers.resolveRestOfCombat();

    // Printed go again is combo-conditional: without Edge of Autumn as the
    // last attack on the chain, the spent action point stays spent.
    expectFabPlayer(Fai).toHaveAP(0);
  });

  it("boundary: 2{p} attack; defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [seekVengeanceBlue, seekVengeanceBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    // Dash's turn: 4{p} Snatch into a 3{d} block leaves 1 damage.
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Fai.defendWith([seekVengeanceBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveLife(19);

    Dash.endTurn();
    game.helpers.untilIdle();

    Fai.playAttack(seekVengeanceBlue);
    expectCombat(game).toHaveAttackPower(2);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(18);
    expect(Fai.zone("graveyard")).toContain(seekVengeanceBlue.canonicalId);
  });
});

/**
 * Seek Vengeance, Red (ASR012) — combo-conditional go again (W2-FIX2
 * removed the unprinted module `goAgain`; CRU151-class fix).
 *
 * Printed: "Combo - If Edge of Autumn was the last attack this combat
 * chain, this gets go again." — go again is combo-conditional only and is
 * granted by the resolution ability. Proven in both directions: the action
 * point refunds after an Edge of Autumn link and does not refund without
 * one.
 */

describe("Seek Vengeance (ASR012) AAA", () => {
  it("playline: after an Edge of Autumn attack, the combo link refunds its action point", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [seekVengeanceRed],
        weapon1: [edgeOfAutumn],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.activate(edgeOfAutumn);
    game.advanceCombatTo("resolution");

    Fai.playAttack(seekVengeanceRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(15); // 1 (sword) + 4 (Seek Vengeance)
    // the sword's and the combo link's go agains refund both spends.
    expectFabPlayer(Fai).toHaveAP(2);
  });

  it("boundary: no Edge of Autumn on the chain — the action point is not refunded", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [seekVengeanceRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(seekVengeanceRed);
    game.helpers.resolveRestOfCombat();

    // Printed go again is combo-conditional: without Edge of Autumn as the
    // last attack on the chain, the spent action point stays spent.
    expectFabPlayer(Fai).toHaveAP(0);
  });

  it("boundary: 4{p} attack; defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [seekVengeanceRed, seekVengeanceRed], actionPoints: 1, life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    // Dash's turn: 4{p} Snatch into a 3{d} block leaves 1 damage.
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Fai.defendWith([seekVengeanceRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveLife(19);

    Dash.endTurn();
    game.helpers.untilIdle();

    Fai.playAttack(seekVengeanceRed);
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(16);
    expect(Fai.zone("graveyard")).toContain(seekVengeanceRed.canonicalId);
  });
});
