import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { tuffnut } from "../heroes/tuffnut.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultRed } from "./brutal-assault.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { showOfStrengthRed } from "./show-of-strength.ts";

describe("Show of Strength (SUP128) AAA", () => {
  it("happy: a 6+{p} defender reduces this by 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [showOfStrengthRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);
    const Dash = game.as(dash);

    Tuffnut.attackWith(showOfStrengthRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });

  it("boundary: an undefended attack stays at printed 8", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [showOfStrengthRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(tuffnut).attackWith(showOfStrengthRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(12);
  });

  it("boundary: a 4{p} defender does not reduce this", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [showOfStrengthRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);
    const Dash = game.as(dash);

    Tuffnut.attackWith(showOfStrengthRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
  });
});
