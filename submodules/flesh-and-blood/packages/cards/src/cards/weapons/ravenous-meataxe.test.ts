import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { alphaRampageRed } from "../actions/alpha-rampage.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { ravenousMeataxe } from "./ravenous-meataxe.ts";

describe("Ravenous Meataxe (LEV003) AAA", () => {
  it("ends the game immediately when weapon damage reduces the opposing hero to zero", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        weapon1: [ravenousMeataxe],
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: dash, life: 3, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.activate(ravenousMeataxe);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(0);
    expect(game.hasGameEnded()).toBe(true);
    expect(game.getGameEndResult().winnerId).toBe(Levia.id);
  });

  it("happy: attacking draws then discards a 6+{p} card and the axe gains +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        weapon1: [ravenousMeataxe],
        hand: [],
        // Deck arrays are bottom→top; last entry is drawn.
        deck: [nimblismBlue, nimblismBlue, alphaRampageRed],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.activate(ravenousMeataxe);
    game.passBoth();
    game.advanceCombatTo("defend");

    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    expect(Levia.zone("graveyard")).toContain(alphaRampageRed.canonicalId);
  });

  it("boundary: discarding a card with less than 6{p} leaves the axe at 3", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        weapon1: [ravenousMeataxe],
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(levia).activate(ravenousMeataxe);
    game.passBoth();
    game.advanceCombatTo("defend");

    expect(game.combat()?.activeLink?.attackPower).toBe(3);
  });

  it("timing: once per turn — a second activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        weapon1: [ravenousMeataxe],
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 4,
        actionPoints: 2,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.activate(ravenousMeataxe);
    game.helpers.resolveRestOfCombat();

    Levia.expectActivationRejected(ravenousMeataxe);
  });
});
