import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromai } from "../heroes/dromai.ts";
import { aetherAshwing } from "../tokens/aether-ashwing.ts";
import { stormOfSandikai } from "./storm-of-sandikai.ts";

describe("Storm of Sandikai (DRO004) AAA", () => {
  it("happy: Dragon allies you control may Attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        weapon1: [stormOfSandikai],
        arena: [aetherAshwing],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);
    Dromai.activate(aetherAshwing);
    expectCombat(game).toBeOpen();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(19);
  });

  it("boundary: without the scepter, a Dragon ally has no Attack activation", () => {
    const game = FabTestEngine.start(
      { hero: dromai, arena: [aetherAshwing], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);
    expect(() => Dromai.activate(aetherAshwing)).toThrow();
  });

  it("timing: the granted Attack is once per turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        weapon1: [stormOfSandikai],
        arena: [aetherAshwing],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);
    Dromai.activate(aetherAshwing);
    game.helpers.resolveRestOfCombat();
    expect(() => Dromai.activate(aetherAshwing)).toThrow();
  });
});
