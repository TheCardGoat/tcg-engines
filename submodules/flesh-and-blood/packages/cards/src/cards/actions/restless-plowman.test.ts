import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { malice } from "../heroes/malice.ts";
import { dash } from "../heroes/dash.ts";
import { restlessPlowmanRed } from "./restless-plowman.ts";

/**
 * Restless Plowman, Red — Shadow Necromancer Action - Zombie Ally, Decay.
 *
 * Printed: "Action - {t}: Gain {r}. Go again\nDecay"
 */

describe("Restless Plowman AAA", () => {
  it("happy: tapping the plowman gains {r} and the go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        arena: [restlessPlowmanRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.activate(restlessPlowmanRed);
    game.untilIdle();

    expectFabPlayer(Malice).toHaveResourceCount(1).toHaveAP(1);
    expectFabCard(Malice, restlessPlowmanRed).toBeTapped();
  });

  it("boundary: the tapped plowman cannot harvest again this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        arena: [restlessPlowmanRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.activate(restlessPlowmanRed);
    game.untilIdle();

    Malice.expectActivationRejected(restlessPlowmanRed);
    expectFabPlayer(Malice).toHaveResourceCount(1);
  });
});
