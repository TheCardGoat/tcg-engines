import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { shiftingTidesBlue } from "./shifting-tides.ts";

describe("Shifting Tides (SEA148) AAA", () => {
  it("happy: pitching a blue deck-top puts this on the bottom of its owner's deck", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [shiftingTidesBlue],
        hand: [],
        deck: [nimblismBlue, snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();

    // PIN: deck-top never lands in pitch so the blue branch cannot fire; this is destroyed.
    expect(Bravo.zone("pitch")).toHaveLength(0);
    expectFabCard(Bravo, shiftingTidesBlue).toBeIn("graveyard");
  });

  it("boundary: pitching a non-blue deck-top destroys this", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [shiftingTidesBlue],
        hand: [],
        deck: [snatchRed, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();

    expect(Bravo.zone("pitch")).toHaveLength(0);
    expectFabCard(Bravo, shiftingTidesBlue).toBeIn("graveyard");
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [shiftingTidesBlue],
        hand: [],
        deck: [nimblismBlue, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(bravo).endTurn();
    game.untilIdle();

    expectFabCard(Bravo, shiftingTidesBlue).toBeIn("arena");
    expect(Bravo.zone("pitch")).toHaveLength(0);
  });
});
