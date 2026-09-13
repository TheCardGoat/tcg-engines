import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { icyEncounterRed } from "./icy-encounter.ts";

describe("Icy Encounter (ELE157) AAA", () => {
  it("happy: when this hits a hero, a Frostbite is created under their control", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [icyEncounterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.playAttack(icyEncounterRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(14);
    expect(Dash.zone("arena")).toContain("token:frostbite");
    expect(Oldhim.zone("arena")).not.toContain("token:frostbite");
    expect(game.combat()).toBeNull();
  });

  it("boundary: a miss creates no Frostbite", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [icyEncounterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.playAttack(icyEncounterRed);
    Dash.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("arena")).not.toContain("token:frostbite");
    expect(Oldhim.zone("arena")).not.toContain("token:frostbite");
  });

  it("timing: the Frostbite is created on hit, not on play", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [icyEncounterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.playAttack(icyEncounterRed);

    expect(game.combat()?.open).toBe(true);
    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("arena")).not.toContain("token:frostbite");

    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("arena")).toContain("token:frostbite");
  });
});
