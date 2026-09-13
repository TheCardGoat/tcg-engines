import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { ravenousRabbleRed } from "./ravenous-rabble.ts";
import { snatchRed } from "./snatch.ts";
import { revelInRunebloodRed } from "./revel-in-runeblood.ts";

describe("Revel in Runeblood (EVR106) AAA", () => {
  it("happy: after an attack action this turn, create 4 Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [ravenousRabbleRed, revelInRunebloodRed],
        deck: [snatchRed],
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.attackWith(ravenousRabbleRed);
    game.helpers.resolveUntilIdle();
    game.helpers.resolveRestOfCombat();
    Vynnset.play(revelInRunebloodRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 4);
  });

  it("boundary: without a prior attack action, create no Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [revelInRunebloodRed],
        deck: 6,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(revelInRunebloodRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 0);
    expectFabPlayer(Vynnset).toHaveAP(1);
  });

  it("timing: end phase destroys Runechants you control", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [ravenousRabbleRed, revelInRunebloodRed],
        deck: [snatchRed],
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.attackWith(ravenousRabbleRed);
    game.helpers.resolveUntilIdle();
    game.helpers.resolveRestOfCombat();
    Vynnset.play(revelInRunebloodRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 4);

    Vynnset.endTurn();
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 0);
  });
});
