import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { hellboundAssaultYellow } from "./hellbound-assault.ts";
import { nimblismBlue } from "./nimblism.ts";
import { harbingerOfDestructionRed } from "./harbinger-of-destruction.ts";

/**
 * Harbinger of Destruction, Red (IAR170) — Shadow Action - Attack, cost 8,
 * 13{p}, Blood Debt.
 *
 * Printed: "As an additional cost to play this, banish a card from your hand.
 * If a Shadow card was banished this way, this gets "When this hits, create 2
 * Gate to i'Arathael tokens."\nBlood Debt"
 */

describe("Harbinger of Destruction (IAR170) AAA", () => {
  it("happy: banishing a Shadow card as the cost arms 2 Gate tokens on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [harbingerOfDestructionRed, hellboundAssaultYellow],
        resourcePoints: 8,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(harbingerOfDestructionRed);
    expectCombat(game).toHaveAttackPower(13);
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(7);
    expectFabPlayer(Rhinar).toHaveTokenCount("gate-to-i-arathael", 2);
    expectFabCard(Rhinar, hellboundAssaultYellow).toBeIn("banished");
  });

  it("boundary: a non-Shadow banish pays the cost without arming the Gates", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [harbingerOfDestructionRed, nimblismBlue],
        resourcePoints: 8,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(harbingerOfDestructionRed);
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(7);
    expectFabPlayer(Rhinar).toHaveTokenCount("gate-to-i-arathael", 0);
    expectFabCard(Rhinar, nimblismBlue).toBeIn("banished");
  });
});
