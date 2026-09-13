import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { hulkUpRed } from "./hulk-up.ts";

describe("Hulk Up family AAA", () => {
  it("happy: costs 3 and hits for 8 when you have less life than the other hero", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        life: 15,
        hand: [hulkUpRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.attackWith(hulkUpRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(12);
    expectFabCard(Tuffnut, hulkUpRed).toBeIn("graveyard");
  });

  it("boundary: full cost 4 when life is not strictly less than the other hero", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        life: 20,
        hand: [hulkUpRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    expectFabCard(Tuffnut, hulkUpRed).toHaveCost(4);
    expect(() => Tuffnut.attackWith(hulkUpRed)).toThrow();
  });
});
