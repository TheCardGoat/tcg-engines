import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { boltOfCourageRed } from "./bolt-of-courage.ts";
import { takeFlightRed } from "./take-flight.ts";

/**
 * Take Flight, Red (BOL016) — optional charge + conditional go again.
 * Clean module (no unprinted keywords; W2-FIX2 removed the class defect on
 * the BOL010 sibling, this family's grants are resolution abilities only).
 *
 * Printed: "As an additional cost to play Take Flight, you may charge your
 * hero's soul. If you've charged this turn, Take Flight gains go again." —
 * cost 1, 4{p}, defense 3. Both directions are exercised through public
 * play: the charge moves a hand card to the soul zone, and the conditional
 * go again is observable via the action-point refund.
 */

describe("Take Flight (BOL016) AAA", () => {
  it("playline: after charging this turn, Take Flight refunds its action point", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [boltOfCourageRed, nimblismBlue, takeFlightRed],
        resourcePoints: 1,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    // Bolt of Courage with its optional charge stamps charged-this-turn.
    Boltyn.attackWith(boltOfCourageRed, {
      charge: true,
      chargeCard: nimblismBlue,
    });
    game.helpers.resolveRestOfCombat();

    Boltyn.attackWith(takeFlightRed);
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(13); // 3 + 4
    expect(Boltyn.zone("soul")).toContain(nimblismBlue.canonicalId);
    // the charged go again refunds Take Flight's action point.
    expectFabPlayer(Boltyn).toHaveAP(2);
  });

  it("boundary: no charge this turn — the action point is not refunded", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [takeFlightRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.attackWith(takeFlightRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16); // printed 4{p}
    // Printed go again is charge-conditional: without charging this turn,
    // the spent action point stays spent.
    expectFabPlayer(Boltyn).toHaveAP(0);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [takeFlightRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    // Dash's turn: 4{p} Snatch into a 3{d} block leaves 1 damage.
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Boltyn.defendWith([takeFlightRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveLife(19);
    expect(Boltyn.zone("graveyard")).toContain(takeFlightRed.canonicalId);
  });
});
