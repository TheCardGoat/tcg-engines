import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { inertia } from "./inertia.ts";

describe("Inertia (ARA029) AAA", () => {
  it("happy: at your end phase this is destroyed and your hand and arsenal go to the bottom of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [inertia],
        hand: [snatchRed],
        arsenal: [nimblismBlue],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("arena")).not.toContain(inertia.canonicalId);
    expect(Bravo.zone("deck")).toContain(snatchRed.canonicalId);
    expect(Bravo.zone("deck")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("arsenal")).toHaveLength(0);
  });

  it("boundary: Inertia does not dump zones on the opponent's end phase", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [inertia],
        hand: [snatchRed],
        arsenal: [nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, inertia).toBeIn("arena");
    expectFabCard(Bravo, snatchRed).toBeIn("hand");
    expectFabCard(Bravo, nimblismBlue).toBeIn("arsenal");
  });

  it("timing: an empty hand and arsenal still destroys Inertia at your end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [inertia],
        hand: [],
        arsenal: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    expect(Bravo.zone("arena")).not.toContain(inertia.canonicalId);
  });
});
