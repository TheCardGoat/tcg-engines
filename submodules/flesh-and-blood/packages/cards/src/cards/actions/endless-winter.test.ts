import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blossomOfSpring } from "../equipment/blossom-of-spring.ts";
import { blizzardBlue } from "../instants/blizzard.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { nimblismBlue } from "./nimblism.ts";
import { endlessWinterRed } from "./endless-winter.ts";

/**
 * Endless Winter (ELE004) — Elemental Guardian Attack, cost 4, 8{p}/3{d}.
 *
 * Printed: Oldhim Specialization. Ice Fusion.
 * If Endless Winter was fused, whenever the defending hero adds a defending
 * card to this chain link, create a Frostbite token under their control.
 * If Endless Winter hits a hero, until the end of their next turn, whenever
 * they activate an ability, create a Frostbite token under their control.
 */

describe("Endless Winter (ELE004) AAA", () => {
  it("happy: an unfused hit still deals 8 and then an activation on their next turn creates a Frostbite", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [endlessWinterRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        chest: [blossomOfSpring],
        hand: [],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.playAttack(endlessWinterRed);
    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(12);
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 0);

    Oldhim.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    Dash.activate(blossomOfSpring);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 1);
  });

  it("boundary: without fusion, adding a defending card does not create a Frostbite", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [endlessWinterRed, blizzardBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.playAttack(endlessWinterRed);
    Dash.defendWith(nimblismBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 0);
    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("timing: fused, a defending card creates a Frostbite under the defender", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [endlessWinterRed, blizzardBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.playAttack(endlessWinterRed, { fuse: true, fuseCards: [blizzardBlue] });
    Dash.defendWith(nimblismBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 1);
  });
});
