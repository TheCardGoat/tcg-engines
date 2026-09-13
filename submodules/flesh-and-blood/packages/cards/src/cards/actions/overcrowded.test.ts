import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { overcrowdedBlue } from "./overcrowded.ts";

describe("Overcrowded (SUP216) AAA", () => {
  it("happy: on attack gets +1{p} for each different aura-token name in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [overcrowdedBlue],
        // two Toughness + one Agility → 2 distinct names
        arena: [fabToken("toughness"), fabToken("agility"), fabToken("toughness")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(overcrowdedBlue);
    game.passBoth();
    // printed 1{p} + 2 distinct names
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
  });

  it("boundary: with no aura tokens in the arena this stays at printed 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [overcrowdedBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).attackWith(overcrowdedBlue);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(1);
  });

  it("timing: the same bonus applies when this defends", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [overcrowdedBlue],
        arena: [fabToken("toughness"), fabToken("agility")],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(overcrowdedBlue);
    // printed 2{d} + 2 distinct names = 4; snatch is 4{p} → 0 damage
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(20);
  });
});
