import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { hyperDriverRed } from "./hyper-driver.ts";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "./snatch.ts";
import { adaptivePlating } from "../equipment/adaptive-plating.ts";
import { smashWithBigRockYellow } from "./smash-with-big-rock.ts";

/**
 * Smash with Big Rock (SUP133) — Brute Attack, cost 2, 6{p}.
 *
 * Printed: Cards defending this can't gain {d}.
 *
 * CR 6.3.1 / 6.3.7: restrict-gain-defense is a game-rule CE applied before
 * later numeric adds. Galvanize's +2{d} is until-end-of-turn, so after this
 * chain closes the restriction expires and the leftover CE can apply — the
 * printed proof is combat math (6{p} vs printed 1{d} → 5 damage).
 */

describe("Smash with Big Rock (SUP133) AAA", () => {
  it("happy: galvanize +2{d} does not change combat math on a card defending this", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [smashWithBigRockYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        chest: [adaptivePlating],
        arena: [hyperDriverRed],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(smashWithBigRockYellow);
    Dash.defendWith(adaptivePlating);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Dash.target(hyperDriverRed);

    // 6{p} vs printed 1{d} = 5 damage. 6 vs galvanized 3{d} would be life 17.
    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Dash, adaptivePlating).toBeIn("graveyard");
  });

  it("boundary: galvanize still grants +2{d} against a Generic attack", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        chest: [adaptivePlating],
        arena: [hyperDriverRed],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(snatchRed);
    Dash.defendWith(adaptivePlating);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Dash.target(hyperDriverRed);

    expectFabCard(Dash, adaptivePlating).toHaveDefense(3);
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("timing: after this chain closes, galvanize works on the next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [smashWithBigRockYellow, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        chest: [adaptivePlating],
        arena: [hyperDriverRed],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(smashWithBigRockYellow);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(14);

    Rhinar.playAttack(snatchRed);
    Dash.defendWith(adaptivePlating);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Dash.target(hyperDriverRed);
    expectFabCard(Dash, adaptivePlating).toHaveDefense(3);
  });
});
