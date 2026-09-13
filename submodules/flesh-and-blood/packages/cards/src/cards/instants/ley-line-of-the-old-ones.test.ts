import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { seismicSurge } from "../tokens/seismic-surge.ts";
import { leyLineOfTheOldOnesBlue } from "./ley-line-of-the-old-ones.ts";

/**
 * Ley Line of the Old Ones Blue (MPG013) — Guardian Instant Aura (Legendary).
 *
 * Printed: At the beginning of your end phase, if you control no Seismic
 * Surge tokens, destroy this.
 */

describe("Ley Line of the Old Ones (MPG013) AAA", () => {
  it("happy: with no Seismic Surge this is destroyed at the beginning of your end phase", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [leyLineOfTheOldOnesBlue], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(leyLineOfTheOldOnesBlue);
    game.passBoth();
    expectFabCard(Bravo, leyLineOfTheOldOnesBlue).toBeIn("arena");

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, leyLineOfTheOldOnesBlue).toBeIn("graveyard");
  });

  it("boundary: a controlled Seismic Surge keeps this in the arena through your end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [leyLineOfTheOldOnesBlue],
        arena: [seismicSurge],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(leyLineOfTheOldOnesBlue);
    game.passBoth();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, leyLineOfTheOldOnesBlue).toBeIn("arena");
  });

  it("timing: resolving this does not destroy it before the end phase", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [leyLineOfTheOldOnesBlue], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(leyLineOfTheOldOnesBlue);
    game.passBoth();

    expectFabCard(Bravo, leyLineOfTheOldOnesBlue).toBeIn("arena");
  });
});
