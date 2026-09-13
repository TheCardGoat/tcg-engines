import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { nimblismBlue } from "./nimblism.ts";
import { hellboundAssaultRed } from "./hellbound-assault.ts";

/**
 * Hellbound Assault — Shadow Brute Action - Attack (red: cost 2, 7{p}).
 *
 * Printed: "When this hits, banish it.\nBlood Debt"
 */

describe("Hellbound Assault (IAR011) AAA", () => {
  it("happy: when this hits, it is banished instead of resting in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [hellboundAssaultRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(hellboundAssaultRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabCard(Rhinar, hellboundAssaultRed).toBeIn("banished");
  });

  it("boundary: a fully defended attack misses and the card stays in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [hellboundAssaultRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(hellboundAssaultRed);
    expectCombat(game).toHaveAttackPower(7);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Rhinar, hellboundAssaultRed).toBeIn("graveyard");
  });
});
