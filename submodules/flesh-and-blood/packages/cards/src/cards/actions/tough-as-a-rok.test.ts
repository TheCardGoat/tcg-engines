import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { tuffnut } from "../heroes/tuffnut.ts";
import { dash } from "../heroes/dash.ts";
import { toughAsARokBlue } from "./tough-as-a-rok.ts";

describe("Tough as a Rok (PEN285) AAA", () => {
  it("happy: with less {h} than the opposing hero this attacks for base 6", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [toughAsARokBlue],
        resourcePoints: 3,
        actionPoints: 1,
        life: 15,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.attackWith(toughAsARokBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabCard(Tuffnut, toughAsARokBlue).toBeIn("graveyard");
  });

  it("boundary: with equal {h} this attacks for base 0", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [toughAsARokBlue],
        resourcePoints: 3,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.attackWith(toughAsARokBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(0);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
