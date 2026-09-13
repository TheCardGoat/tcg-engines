import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { anothos } from "../weapons/anothos.ts";
import { nimblismBlue } from "./nimblism.ts";
import { heavySwingRed } from "./heavy-swing.ts";

/**
 * Heavy Swing — Warrior Action - Aura (red, cost 0).
 *
 * Printed: "At the start of your turn, destroy this and your next sword
 * attack this turn gets +3{p}."
 */

describe("Heavy Swing (MPW133) AAA", () => {
  it("happy: the start of your turn destroys the aura and powers the next sword attack by +3", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: dorinthea,
        arena: [heavySwingRed],
        hand: [nimblismBlue],
        weapon1: [dawnblade],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Dori, heavySwingRed).toBeIn("graveyard");

    Dori.activate(dawnblade);
    Dori.pitchFirst();
    game.passBoth();
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: a non-sword weapon attack does not get the +3{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [heavySwingRed],
        hand: [nimblismBlue],
        weapon1: [anothos],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Bravo, heavySwingRed).toBeIn("graveyard");

    Bravo.activate(anothos);
    Bravo.pitchFirst();
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the aura survives the opponent's turn and only fires at your action phase", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        arena: [heavySwingRed],
        weapon1: [dawnblade],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    game.as(dorinthea).endTurn();
    game.untilIdle();

    expectFabCard(Dori, heavySwingRed).toBeIn("arena");
  });
});
