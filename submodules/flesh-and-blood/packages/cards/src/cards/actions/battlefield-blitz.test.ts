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
import { battlefieldBlitzRed } from "./battlefield-blitz.ts";

/**
 * Battlefield Blitz, Red (BOL010) — charge-conditional go again
 * (W2-FIX2 removed the unprinted module `goAgain`; CRU151-class fix).
 *
 * Printed: "If you've charged this turn, Battlefield Blitz gains go
 * again." — go again is charge-conditional only and is granted by the
 * resolution ability. Proven in both directions: the action point refunds
 * after a charge this turn and does not refund without one.
 */

describe("Battlefield Blitz (BOL010) AAA", () => {
  it("playline: after charging this turn, the blitz refunds its action point", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [boltOfCourageRed, nimblismBlue, battlefieldBlitzRed],
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

    Boltyn.attackWith(battlefieldBlitzRed);
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(12); // 3 + 5
    // the charged go again refunds the blitz's action point.
    expectFabPlayer(Boltyn).toHaveAP(2);
  });

  it("boundary: no charge this turn — the action point is not refunded", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [battlefieldBlitzRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(battlefieldBlitzRed);
    game.helpers.resolveRestOfCombat();

    // Printed go again is charge-conditional: without charging this turn,
    // the spent action point stays spent.
    expectFabPlayer(Boltyn).toHaveAP(0);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [battlefieldBlitzRed],
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
    Boltyn.defendWith([battlefieldBlitzRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveLife(19);
    expect(Boltyn.zone("graveyard")).toContain(battlefieldBlitzRed.canonicalId);
  });
});
