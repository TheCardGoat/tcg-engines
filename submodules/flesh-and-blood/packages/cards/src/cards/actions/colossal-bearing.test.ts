import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { battleClearingBellowBlue } from "./battle-clearing-bellow.ts";
import { colossalBearingRed } from "./colossal-bearing.ts";
import { nimblismBlue } from "./nimblism.ts";
import { blossomOfSpring } from "../equipment/blossom-of-spring.ts";

/**
 * Colossal Bearing (HVY062) — Guardian Action - Attack, cost 4, 8{p}, Tower.
 *
 * Printed: "Tower - If this has 13 or more {p}, it gets "When this hits a
 * hero, destroy an equipment they control with 1 or less {d}.""
 */

describe("Colossal Bearing (HVY062) AAA", () => {
  it("happy: at 13+ power a hit destroys an equipment with 1 or less {d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [battleClearingBellowBlue, colossalBearingRed],
        resourcePoints: 7,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        chest: [blossomOfSpring],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(battleClearingBellowBlue);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(colossalBearingRed, { optionals: "decline" });

    expectCombat(game).toHaveAttackPower(14);
    game.closeCombat({ entityTargets: "maximum" });

    expectFabPlayer(Dash).toHaveLife(6);
    expectFabCard(Dash, blossomOfSpring).toBeIn("graveyard");
  });

  it("boundary: below 13 power the hit destroys no equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [colossalBearingRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        chest: [blossomOfSpring],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(colossalBearingRed, { optionals: "decline" });

    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(12);
    expectFabCard(Dash, blossomOfSpring).toBeIn("chest");
  });

  it("timing: 13+ power that never hits leaves the equipment alone", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [battleClearingBellowBlue, colossalBearingRed],
        resourcePoints: 7,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        hand: [
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
        ],
        chest: [blossomOfSpring],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(battleClearingBellowBlue);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(colossalBearingRed, { optionals: "decline" });
    expectCombat(game).toHaveAttackPower(14);
    Dash.defendWith(
      nimblismBlue,
      nimblismBlue,
      nimblismBlue,
      nimblismBlue,
      nimblismBlue,
      nimblismBlue,
      nimblismBlue,
    );
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, blossomOfSpring).toBeIn("chest");
  });
});
