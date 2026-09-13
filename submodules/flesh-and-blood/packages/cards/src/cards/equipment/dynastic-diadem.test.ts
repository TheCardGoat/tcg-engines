import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { cindra } from "../heroes/cindra.ts";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { pledgeFealtyRed } from "../instants/pledge-fealty.ts";
import { destructiveFleetfootBlue } from "../actions/destructive-fleetfoot.ts";
import { dynasticDiadem } from "./dynastic-diadem.ts";

/**
 * Dynastic Diadem — Draconic Equipment - Head, d1 Temper.
 *
 * Printed:
 *   Fealty tokens you control can't be destroyed by opponents' effects.
 *   If you control 3 or more Fealty tokens, this gets +1{d}.
 *   Temper
 */

describe("Dynastic Diadem (PEN252) AAA", () => {
  it("happy: with 3 Fealty tokens the diadem defends at 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        head: [dynasticDiadem],
        hand: [pledgeFealtyRed, pledgeFealtyRed, pledgeFealtyRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Cindra = game.as(cindra);

    // Fealty is created by a 0-cost Instant — no action points spent.
    for (let i = 0; i < 3; i += 1) {
      Cindra.play(pledgeFealtyRed);
      game.passBoth();
    }
    expectFabPlayer(Cindra).toHaveTokenCount("fealty", 3);
    Cindra.endTurn();

    game.as(dash).playAttack(snatchRed);
    Cindra.defendWith(dynasticDiadem);
    game.helpers.resolveRestOfCombat();

    // Snatch 4{p} vs 1{d} + 1 (3+ Fealty) = 2 damage.
    expectFabPlayer(Cindra).toHaveLife(18);
  });

  it("boundary: fewer than 3 Fealty leaves the diadem at printed 1{d}", () => {
    const game = FabTestEngine.start(
      { hero: cindra, head: [dynasticDiadem], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Cindra = game.as(cindra);

    Cindra.endTurn();
    game.as(dash).playAttack(snatchRed);
    Cindra.defendWith(dynasticDiadem);
    game.helpers.resolveRestOfCombat();

    // Snatch 4{p} vs printed 1{d} = 3 damage.
    expectFabPlayer(Cindra).toHaveLife(17);
  });

  it("interaction: an opponent's on-hit aura-token destroy cannot remove a Fealty", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        head: [dynasticDiadem],
        hand: [pledgeFealtyRed, pledgeFealtyRed, pledgeFealtyRed],
        life: 20,
        deck: 6,
      },
      {
        hero: chane,
        hand: [destructiveFleetfootBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Cindra = game.as(cindra);

    for (let i = 0; i < 3; i += 1) {
      Cindra.play(pledgeFealtyRed);
      game.passBoth();
    }
    Cindra.endTurn();

    // Fleetfoot's on-hit "destroy an aura token they control" is an
    // opponents' effect — the diadem protects the Fealty; the 1 damage lands.
    game.as(chane).playAttack(destructiveFleetfootBlue);
    Cindra.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Cindra).toHaveTokenCount("fealty", 3);
    expectFabPlayer(Cindra).toHaveLife(19);
  });
});
