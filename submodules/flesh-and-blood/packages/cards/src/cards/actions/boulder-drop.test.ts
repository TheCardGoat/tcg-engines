import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { jarlVetreiI } from "../heroes/jarl-vetrei-i.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { nimblismBlue } from "./nimblism.ts";
import { boulderDropRed } from "./boulder-drop.ts";

describe("Boulder Drop family AAA", () => {
  it("happy: crush puts a card from the damaged hero's hand on top of their deck", () => {
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        hand: [boulderDropRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);
    const Dash = game.as(dash);

    Jarl.attackWith(boulderDropRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    game.helpers.resolveRestOfCombat();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabPlayer(Dash).toHaveHandCount(0);
    expect(Dash.zone("deck")).toContain(brutalAssaultBlue.canonicalId);
    expectFabCard(Jarl, boulderDropRed).toBeIn("graveyard");
  });

  it("boundary: dealing 3 damage does not fire crush", () => {
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        hand: [boulderDropRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);
    const Dash = game.as(dash);

    Jarl.attackWith(boulderDropRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, brutalAssaultBlue]);
    game.helpers.resolveRestOfCombat();

    // 7{p} − (2+3){d} = 2 damage < 4, so crush does not fire.
    expectFabPlayer(Dash).toHaveLife(18);
    expectFabPlayer(Dash).toHaveHandCount(0);
    expect(Dash.zone("deck")[0]).not.toBe(nimblismBlue.canonicalId);
    expect(Dash.zone("deck")[0]).not.toBe(brutalAssaultBlue.canonicalId);
  });
});
