import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "./voltic-bolt.ts";
import { dash } from "../heroes/dash.ts";
import { verdance } from "../heroes/verdance.ts";
import { snatchRed } from "./snatch.ts";
import { ringOfRosesYellow } from "./ring-of-roses.ts";

/**
 * Ring of Roses (HNT256) — Earth Wizard Aura, Legendary Verdance Specialization.
 * Printed: the first time you deal arcane damage each turn, gain 1{h}.
 */

describe("Ring of Roses (HNT256) AAA", () => {
  it("happy: first arcane damage each turn gains 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: verdance,
        arena: [ringOfRosesYellow],
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Verdance = game.as(verdance);

    Verdance.play(volticBoltRed, { target: game.as(dash).id });
    game.untilIdle();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabPlayer(Verdance).toHaveLife(21);
  });

  it("boundary: combat damage does not gain life", () => {
    const game = FabTestEngine.start(
      {
        hero: verdance,
        arena: [ringOfRosesYellow],
        hand: [snatchRed],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Verdance = game.as(verdance);

    Verdance.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Verdance).toHaveLife(20);
  });

  it("timing: a second arcane source the same turn does not gain another {h}", () => {
    const game = FabTestEngine.start(
      {
        hero: verdance,
        arena: [ringOfRosesYellow],
        hand: [volticBoltRed, volticBoltRed],
        resourcePoints: 4,
        actionPoints: 2,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Verdance = game.as(verdance);
    const Dash = game.as(dash);

    Verdance.play(volticBoltRed, { target: Dash.id });
    game.untilIdle();
    Verdance.play(volticBoltRed, { target: Dash.id });
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(10);
    expectFabPlayer(Verdance).toHaveLife(21);
  });
});
