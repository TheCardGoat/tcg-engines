import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { earthFormRed } from "./earth-form.ts";

describe("Earth Form (ROS036) AAA", () => {
  it("happy: when this hits, an Embodiment of Earth is created under your control", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [earthFormRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.playAttack(earthFormRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(13);
    expect(Oldhim.zone("arena")).toContain("token:embodiment-of-earth");
    expect(Dash.zone("arena")).not.toContain("token:embodiment-of-earth");
    expect(game.combat()).toBeNull();
  });

  it("boundary: a miss creates no Embodiment of Earth", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [earthFormRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.playAttack(earthFormRed);
    Dash.defendWith(brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Oldhim.zone("arena")).not.toContain("token:embodiment-of-earth");
    expect(Dash.zone("arena")).not.toContain("token:embodiment-of-earth");
  });

  it("timing: the Embodiment of Earth is created on hit, not on play", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [earthFormRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.playAttack(earthFormRed);

    expect(game.combat()?.open).toBe(true);
    expectFabPlayer(Dash).toHaveLife(20);
    expect(Oldhim.zone("arena")).not.toContain("token:embodiment-of-earth");

    game.helpers.resolveRestOfCombat();

    expect(Oldhim.zone("arena")).toContain("token:embodiment-of-earth");
  });
});
