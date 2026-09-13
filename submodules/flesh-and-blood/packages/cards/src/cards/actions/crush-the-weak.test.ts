import { describe, it } from "vitest";
import {
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { winterSGraspRed } from "./winter-s-grasp.ts";
import { crushTheWeakRed } from "./crush-the-weak.ts";
import { dustupBlue } from "./dustup.ts";

/**
 * Crush the Weak Red (CRU032) — Guardian Attack Action.
 *
 * Printed: Crush - When this deals 4 or more damage to a hero, they can't
 * play attack action cards with 3 or less base {p} during their next action
 * phase.
 */

describe("Crush the Weak family AAA", () => {
  it("happy: Crush locks sub-3{p} attacks during their next action phase", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [crushTheWeakRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [dustupBlue, snatchRed], actionPoints: 1, resourcePoints: 2, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(crushTheWeakRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(13); // 20 - 7, Crush armed

    // CR: sub-3{p}-base attack actions cannot be announced; larger attacks
    // stay legal inside the very same window.
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });
    expectFabUnplayable(
      () => Dash.playAttack(dustupBlue),
      /restricts this object from being played/,
    );
    Dash.playAttack(snatchRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, snatchRed).toBeIn("graveyard"); // 4{p}: outside the lock
  });

  it("boundary: a blocked hit under 4 damage arms nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [crushTheWeakRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [snatchRed, winterSGraspRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // 7 - 4 (grasp block) = 3 damage: below the Crush threshold.
    Bravo.playAttack(crushTheWeakRed);
    Dash.defendWith(winterSGraspRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(16);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });
    Dash.playAttack(snatchRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, snatchRed).toBeIn("graveyard"); // playable
  });
});
