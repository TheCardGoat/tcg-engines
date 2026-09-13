import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { razorReflexRed } from "../attack-reactions/razor-reflex.ts";
import { leapFrogLeggings } from "./leap-frog-leggings.ts";

/**
 * Leap Frog Legs (CIN006) — Assassin Ninja Equipment - Legs.
 * (Blade Break)
 * Printed: "When an opponent plays or activates an attack reaction, you
 * may add this to the active chain link as a defending card."
 */

describe("Leap Frog Legs (CIN006) AAA", () => {
  it("happy: an opposing attack reaction may add this as a defending card", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, razorReflexRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], legs: [leapFrogLeggings], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.passBoth();
    Bravo.play(razorReflexRed, {
      modeIds: [`${razorReflexRed.canonicalId}:chooseMode:attackAction`],
    });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, ordering: "listed" });

    // Razor Reflex made Snatch a 7{p} attack; the accepted snap-defense
    // blocks 1: 7 - 1 = 6.
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: without an attack reaction this stays seated", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], legs: [leapFrogLeggings], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("timing: declining the snap-defense keeps the full hit", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, razorReflexRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], legs: [leapFrogLeggings], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.passBoth();
    Bravo.play(razorReflexRed, {
      modeIds: [`${razorReflexRed.canonicalId}:chooseMode:attackAction`],
    });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    // Declined: the full 7{p} (Snatch 4 + Razor Reflex 3) carries.
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });
});
