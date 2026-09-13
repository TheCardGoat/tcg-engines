import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { crazyBrewBlue } from "./crazy-brew.ts";

describe("Crazy Brew (WTR162) AAA", () => {
  it("happy: destroying this rolls a d6 and applies one printed branch", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [crazyBrewBlue], actionPoints: 1, life: 20, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const lifeBefore = Bravo.life();
    const apBefore = Bravo.actionPoints();

    Bravo.activate(crazyBrewBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, crazyBrewBlue).toBeIn("graveyard");
    const life = Bravo.life();
    const ap = Bravo.actionPoints();
    const gainedLife = life === lifeBefore + 2;
    const lostLife = life === lifeBefore - 2;
    const highRoll = life === lifeBefore && ap >= apBefore;
    expect(gainedLife || lostLife || highRoll).toBe(true);
  });

  it("boundary: without activation the item stays in the arena", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [crazyBrewBlue], actionPoints: 1, life: 20, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, crazyBrewBlue).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("timing: activation is not combat", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [crazyBrewBlue],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).activate(crazyBrewBlue);
    game.helpers.resolveUntilIdle();
    expect(game.combat()).toBeNull();
  });
});
