import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { malice } from "../heroes/malice.ts";
import { dash } from "../heroes/dash.ts";
import { restlessQuartermasterRed } from "./restless-quartermaster.ts";
import { nimblismBlue } from "./nimblism.ts";
import { voxNecropolis } from "../weapons/vox-necropolis.ts";

/**
 * Restless Quartermaster, Red (IAR065) — Shadow Necromancer Action - Zombie
 * Ally, 3{p}, Decay.
 *
 * Printed: "When this hits a hero, they banish a card in their arsenal.\nDecay"
 */

describe("Restless Quartermaster (IAR065) AAA", () => {
  it("happy: hitting a hero banishes the card in their arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [restlessQuartermasterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    Malice.activate(restlessQuartermasterRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, nimblismBlue).toBeIn("banished");
    expect(Dash.zone("arsenal")).toEqual([]);
  });

  it("boundary: with an empty arsenal the hit still lands but banishes nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [restlessQuartermasterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    Malice.activate(restlessQuartermasterRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expect(Dash.zone("banished")).toEqual([]);
  });
});
