import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { voxNecropolis } from "../weapons/vox-necropolis.ts";
import { malice } from "../heroes/malice.ts";
import { restlessMagisterRed } from "./restless-magister.ts";

describe("Restless Magister (IAR064) AAA", () => {
  it("happy: hitting a hero under Vox banishes a card from their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [restlessMagisterRed],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.activate(restlessMagisterRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabCard(game.as(dash), snatchRed).toBeIn("banished");
  });

  it("boundary: without Vox the zombie cannot attack", () => {
    const game = FabTestEngine.start(
      { hero: malice, arena: [restlessMagisterRed], resourcePoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(malice).expectActivationRejected(restlessMagisterRed);
  });

  it("timing: the granted Attack returns the zombie to the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [restlessMagisterRed],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.activate(restlessMagisterRed);
    game.passBoth();
    expect(Malice.zone("combatChain")).toContain(restlessMagisterRed.canonicalId);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Malice, restlessMagisterRed).toBeIn("arena");
  });
});
