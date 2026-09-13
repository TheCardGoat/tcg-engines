import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { snatchRed } from "./snatch.ts";
import { seismicShelterBlue } from "./seismic-shelter.ts";

/**
 * Seismic Shelter (MPG023) — Guardian Action Aura. Go again.
 *
 * Printed: Attack action cards you control get +X{d} while defending, where
 * X is the number of Seismic Surge tokens you control. At the start of your
 * turn, destroy this.
 */

describe("Seismic Shelter (MPG023) AAA", () => {
  it("happy: a defending attack action gets +1{d} per Seismic Surge you control", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        arena: [seismicShelterBlue, fabToken("seismic-surge"), fabToken("seismic-surge")],
        hand: [brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(brutalAssaultBlue);
    game.passBoth();

    expectFabCard(Bravo, brutalAssaultBlue).toHaveDefense(5);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("boundary: with no Seismic Surge the defending attack stays printed {d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        arena: [seismicShelterBlue],
        hand: [brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(brutalAssaultBlue);
    game.passBoth();

    expectFabCard(Bravo, brutalAssaultBlue).toHaveDefense(3);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
  });

  it("timing: this is destroyed at the start of its controller's turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [seismicShelterBlue],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.endTurn();
    game.helpers.untilIdle();
    Dash.endTurn();
    game.helpers.untilIdle();

    expectFabCard(Bravo, seismicShelterBlue).toBeIn("graveyard");
  });
});
