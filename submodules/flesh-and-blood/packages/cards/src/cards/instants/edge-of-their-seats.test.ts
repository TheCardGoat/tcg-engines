import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { edgeOfTheirSeatsRed } from "./edge-of-their-seats.ts";

describe("Edge of Their Seats family AAA", () => {
  it("happy: the red aura enters with two suspense counters", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [edgeOfTheirSeatsRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(edgeOfTheirSeatsRed);
    game.passBoth();

    expectFabCard(Bravo, edgeOfTheirSeatsRed).toBeIn("arena");
    expectFabCard(Bravo, edgeOfTheirSeatsRed).toHaveCounters(2, "suspense");
  });

  it("boundary: playing the aura alone does not create a combat chain", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [edgeOfTheirSeatsRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(edgeOfTheirSeatsRed);
    game.passBoth();

    expect(game.combat()).toBeNull();
    expectFabCard(Bravo, edgeOfTheirSeatsRed).toBeIn("arena");
  });

  it("timing: after suspense expires, the next attack gets +5 power", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [edgeOfTheirSeatsRed], hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, edgeOfTheirSeatsRed).toBeIn("graveyard");
    Bravo.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(9);
  });
});
