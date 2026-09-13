import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { jumpStartYellow } from "./jump-start.ts";
import { expressLightningRed } from "./express-lightning.ts";
import { dutyBoundBlitzRed } from "./duty-bound-blitz.ts";

/**
 * Duty Bound Blitz, Red (PEN183) — Light Attack Action.
 *
 * Printed: "Play this only if a yellow card has been put into your soul this
 * turn.\nGo again" (cost 0, 5{p}, 2{d})
 */

describe("Duty Bound Blitz (PEN183) AAA", () => {
  it("happy: after a yellow card is charged into the soul this turn, this attacks at 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [expressLightningRed, jumpStartYellow, dutyBoundBlitzRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(expressLightningRed, { charge: true, chargeCard: jumpStartYellow });
    game.closeCombat();
    Boltyn.attackWith(dutyBoundBlitzRed);
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(11);
    expectFabPlayer(Boltyn).toHaveAP(1);
  });

  it("boundary: without a yellow card put into the soul this turn, the play is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [dutyBoundBlitzRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    expect(() => Boltyn.attackWith(dutyBoundBlitzRed)).toThrow();
    expectFabCard(Boltyn, dutyBoundBlitzRed).toBeIn("hand");
  });

  it("timing: Go again refunds the action point once the chain link resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [expressLightningRed, jumpStartYellow, dutyBoundBlitzRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(expressLightningRed, { charge: true, chargeCard: jumpStartYellow });
    game.closeCombat();
    expectFabPlayer(Boltyn).toHaveAP(1);
    Boltyn.attackWith(dutyBoundBlitzRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveAP(1);
  });
});
