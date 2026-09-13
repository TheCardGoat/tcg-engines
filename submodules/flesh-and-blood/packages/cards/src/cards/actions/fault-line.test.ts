import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { faultLineRed } from "./fault-line.ts";

describe("Fault Line (MPG032) AAA", () => {
  it("happy: a card in arsenal gives +1{p} and crush puts arsenals on the bottom", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [faultLineRed],
        arsenal: [snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.attackWith(faultLineRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(12);
    expect(Bravo.zone("arsenal")).toHaveLength(0);
    expect(Dash.zone("arsenal")).toHaveLength(0);
  });

  it("boundary: without an arsenal card this stays at printed 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [faultLineRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.attackWith(faultLineRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });
});
