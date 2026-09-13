import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { helmsmanSPeak } from "./helmsman-s-peak.ts";

describe("Helmsman's Peak (SEA180) AAA", () => {
  it("happy: defend looks at the deck top and Blade Breaks", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        head: [helmsmanSPeak],
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const topBefore = Dash.zone("deck").at(-1);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(helmsmanSPeak);
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("deck").at(-1)).toBe(topBefore);
    expectFabCard(Dash, helmsmanSPeak).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: a hand block does not Blade Break the seated helm", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        head: [helmsmanSPeak],
        hand: [nimblismBlue],
        deck: [snatchRed, snatchRed, snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, helmsmanSPeak).toBeIn("head");
    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("timing: Blade Break only fires when this defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, head: [helmsmanSPeak], hand: [], deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, helmsmanSPeak).toBeIn("head");
    expectFabCard(Dash, helmsmanSPeak).toHaveKeyword("blade-break");
  });
});
