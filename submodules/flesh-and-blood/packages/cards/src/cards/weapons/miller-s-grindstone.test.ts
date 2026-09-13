import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { millerSGrindstone } from "./miller-s-grindstone.ts";

describe("Miller's Grindstone (HVY050) AAA", () => {
  it("happy: activate costs 3 resources and attacks for 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [millerSGrindstone],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).activate(millerSGrindstone);
    game.passBoth();
    game.advanceCombatTo("defend");

    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("boundary: once per turn — a second activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [millerSGrindstone],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(millerSGrindstone);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Bravo.expectActivationRejected(millerSGrindstone);
  });

  it("timing: on hit, clash — winning destroys the top of their deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [millerSGrindstone],
        resourcePoints: 3,
        actionPoints: 1,
        // Last entry is the clash reveal (power 4).
        deck: [nimblismBlue, snatchRed],
      },
      {
        hero: dash,
        life: 20,
        hand: [],
        // Last entry is the clash reveal (power 0).
        deck: [snatchRed, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(millerSGrindstone);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectCombat(game).toHaveClashWinner(Bravo);
    expect(Dash.zone("graveyard")).toContain(nimblismBlue.canonicalId);
  });
});
