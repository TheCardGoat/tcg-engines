import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismYellow } from "./nimblism.ts";
import { nimblismBlue } from "./nimblism.ts";
import { lightTheWayRed } from "./light-the-way.ts";

/**
 * Light the Way (DTD066-068) — Light Warrior Attack, cost 0, 3/2/1{p}, 3{d}.
 *
 * Printed: As an additional cost to play this, you may charge your hero's soul.
 * When this hits, if a yellow card was charged this way, this gets go again.
 */

describe("light-the-way family AAA", () => {
  it("happy: charging a yellow card this way and hitting refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [lightTheWayRed, nimblismYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(lightTheWayRed, {
      charge: true,
      chargeCard: nimblismYellow,
    });
    game.closeCombat();

    expectFabCard(Boltyn, nimblismYellow).toBeIn("soul");
    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabPlayer(Boltyn).toHaveAP(1);
  });

  it("boundary: charging a non-yellow card this way does not refund AP", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [lightTheWayRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(lightTheWayRed, {
      charge: true,
      chargeCard: nimblismBlue,
    });
    game.closeCombat();

    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveAP(0);
  });

  it("timing: a miss does not refund AP", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [lightTheWayRed, nimblismYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue, brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.attackWith(lightTheWayRed, {
      charge: true,
      chargeCard: nimblismYellow,
    });
    Dash.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Boltyn).toHaveAP(0);
  });
});
