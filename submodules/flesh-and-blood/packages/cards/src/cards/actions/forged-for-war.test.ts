import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { ironrotPlate } from "../equipment/ironrot-plate.ts";
import { ironrotLegs } from "../equipment/ironrot-legs.ts";
import { forgedForWarYellow } from "./forged-for-war.ts";

/**
 * Forged for War (WTR046) — Guardian Action Aura, cost 2, go again.
 *
 * Printed: Equipment you control gain +1{d}.
 * At the beginning of your action phase, destroy Forged for War.
 */

describe("Forged for War (WTR046) AAA", () => {
  it("happy: equipment you control gains +1{d} and go again refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [ironrotPlate],
        hand: [forgedForWarYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(forgedForWarYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, forgedForWarYellow).toBeIn("arena");
    expectFabCard(Bravo, ironrotPlate).toHaveDefense(2);
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: opponent equipment does not gain +1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [ironrotPlate],
        hand: [forgedForWarYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], legs: [ironrotLegs], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(forgedForWarYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, ironrotLegs).toHaveDefense(1);
    expectFabCard(Bravo, ironrotPlate).toHaveDefense(2);
  });

  it("timing: beginning of your next action phase destroys the aura and the {d} bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [ironrotPlate],
        hand: [forgedForWarYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(forgedForWarYellow);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Bravo, forgedForWarYellow).toBeIn("arena");
    expectFabCard(Bravo, ironrotPlate).toHaveDefense(2);

    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, forgedForWarYellow).toBeIn("graveyard");
    expectFabCard(Bravo, ironrotPlate).toHaveDefense(1);
  });
});
