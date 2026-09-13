import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { snatchRed } from "./snatch.ts";
import { ravenousRabbleRed } from "./ravenous-rabble.ts";

describe("Ravenous Rabble (ARC191) AAA", () => {
  it("happy: revealing a blue (pitch 3) drops this to 2 power", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [ravenousRabbleRed],
        deck: [brutalAssaultBlue],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(ravenousRabbleRed);
    game.passBoth();
    // Printed 5 − pitch 3.
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("boundary: revealing a red (pitch 1) only drops this to 4 power", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [ravenousRabbleRed],
        deck: [snatchRed],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(briar).attackWith(ravenousRabbleRed);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: go again refunds the action point after the chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [ravenousRabbleRed],
        deck: [snatchRed],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(ravenousRabbleRed);
    expectFabPlayer(Briar).toHaveAP(0);
    game.helpers.resolveUntilIdle();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Briar).toHaveAP(1);
  });
});
