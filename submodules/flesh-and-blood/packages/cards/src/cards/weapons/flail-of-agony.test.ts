import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { flailOfAgony } from "./flail-of-agony.ts";

describe("Flail of Agony (DTD135) AAA", () => {
  it("happy: activate pays 1{h} and attacks for 1; hit creates a Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        weapon1: [flailOfAgony],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.activate(flailOfAgony);
    game.passBoth();

    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(1);
    expectFabPlayer(Vynnset).toHaveLife(19);

    game.helpers.resolveRestOfCombat();
    expect(Vynnset.zone("arena")).toContain("token:runechant");
    expectFabPlayer(game.as(dash)).toHaveLife(19);
  });

  it("boundary: once per turn — second activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        weapon1: [flailOfAgony],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.activate(flailOfAgony);
    game.helpers.resolveRestOfCombat();

    Vynnset.expectActivationRejected(flailOfAgony);
  });
});
