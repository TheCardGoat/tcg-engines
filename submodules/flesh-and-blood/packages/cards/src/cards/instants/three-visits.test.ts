import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { threeVisitsRed } from "./three-visits.ts";

describe("Three Visits (MST033) AAA", () => {
  it("happy: Ward 3 after pitching one blue (3 × 1) reduces a 4{p} Snatch to 1", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [threeVisitsRed, nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.play(threeVisitsRed, { pitch: [nimblismBlue, nimblismBlue, nimblismBlue] });
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, threeVisitsRed).toBeIn("arena").toHaveKeyword("ward");
    Bravo.endTurn();
    Dash.attackWith(snatchRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveLife(16);
  });

  it("boundary: with no blues pitched, Ward 0 does not prevent Snatch", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [threeVisitsRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.play(threeVisitsRed);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    Dash.attackWith(snatchRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveLife(16);
  });

  it("timing: the aura is in arena after play", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [threeVisitsRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.play(threeVisitsRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, threeVisitsRed).toBeIn("arena");
  });
});
