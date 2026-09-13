import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { crackerJax } from "./cracker-jax.ts";

describe("Cracker Jax (ELE235) AAA", () => {
  it("happy: destroy this so the next attack action gets +1 power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [crackerJax],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(crackerJax);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, crackerJax).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);

    Bravo.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: a later attack action this turn is not buffed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [crackerJax],
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(crackerJax);
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    Bravo.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the action point spent to activate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [crackerJax],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(crackerJax);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, crackerJax).toBeIn("graveyard");
  });
});
