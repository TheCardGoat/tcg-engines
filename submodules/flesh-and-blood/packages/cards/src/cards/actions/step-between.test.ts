import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { stepBetweenRed } from "./step-between.ts";

/**
 * Step Between (OMN214) — Generic Action Attack, cost 0, 4{p}, 2{d}.
 *
 * Printed: While this is attacking or on the stack, opponents can't play or
 * activate instants.
 */

describe("Step Between (OMN214) AAA", () => {
  it("attacks a hero for printed 4{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [stepBetweenRed], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);

    Dash.playAttack(stepBetweenRed);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Dash, stepBetweenRed).toBeIn("graveyard");
    expectFabPlayer(Azalea).toHaveLife(16);
  });

  it("boundary: seating this in hand does not open combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [stepBetweenRed], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabCard(Dash, stepBetweenRed).toBeIn("hand").toHaveDefense(2);
    expectCombat(game).toBeClosed();
  });

  it("timing: printed 4{p} / 2{d} / cost 0 in hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [stepBetweenRed], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(dash), stepBetweenRed)
      .toBeIn("hand")
      .toHavePower(4)
      .toHaveDefense(2)
      .toHaveCost(0);
  });
});
