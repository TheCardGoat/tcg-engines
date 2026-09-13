import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { malice } from "../heroes/malice.ts";
import { dash } from "../heroes/dash.ts";
import { restlessClericRed } from "./restless-cleric.ts";

/**
 * Restless Cleric, Red (IAR084) — Shadow Necromancer Action - Zombie Ally,
 * 3{p}, Decay.
 *
 * Printed: "Action - {t}: Gain 1{h}. Go again\nDecay"
 */

describe("Restless Cleric (IAR084) AAA", () => {
  it("happy: tapping the cleric gains 1{h} and the go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        arena: [restlessClericRed],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.activate(restlessClericRed);
    game.untilIdle();

    expectFabPlayer(Malice).toHaveLife(21).toHaveAP(1);
    expectFabCard(Malice, restlessClericRed).toBeTapped();
  });

  it("boundary: the tapped cleric cannot heal again this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        arena: [restlessClericRed],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.activate(restlessClericRed);
    game.untilIdle();

    Malice.expectActivationRejected(restlessClericRed);
    expectFabPlayer(Malice).toHaveLife(21);
  });

  it("timing: Decay puts a -1{h} counter on the cleric at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        arena: [restlessClericRed],
        life: 20,
        actionPoints: 1,
        deck: 6,
        intellect: 0,
      },
      { hero: dash, hand: [], life: 20, deck: 6, intellect: 0 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    expectFabCard(Malice, restlessClericRed).toHaveCounters(0);
    Malice.endTurn();

    // Decay counts as a counter on the permanent; Malice's own life is untouched.
    expectFabCard(Malice, restlessClericRed).toHaveCounters(1);
    expectFabPlayer(Malice).toHaveLife(20);
  });
});
