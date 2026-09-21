import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { briar } from "../heroes/briar.ts";
import { chorusOfRotwoodRed } from "./chorus-of-rotwood.ts";
import { nimblismBlue } from "./nimblism.ts";
import { verdantTideRed } from "./verdant-tide.ts";

/**
 * Verdant Tide Red (PEN203) — Elemental Runeblade Action. Go again.
 *
 * Printed: Until end of turn, if you would create 1 or more Elemental or
 * Runeblade aura tokens, instead create that many plus 1 of each of those
 * tokens.
 * Earth Bond - If an Earth card was pitched to play this, create an
 * Embodiment of Earth token.
 */

const padding = [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue];

describe("Verdant Tide (PEN203) AAA", () => {
  it("happy: Runechant creation is amped plus 1 and Earth Bond makes the Embodiment", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [verdantTideRed, chorusOfRotwoodRed, autumnSTouchBlue],
        resourcePoints: 0,
        actionPoints: 2,
        deck: padding,
      },
      { hero: dash, hand: [], deck: padding },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    // Pitching the Earth card pays for Verdant Tide and satisfies Earth Bond.
    Briar.must.pitch(autumnSTouchBlue).play(verdantTideRed);
    game.untilIdle();

    // Earth Bond creates 1 Embodiment — itself an Elemental aura token, so
    // Verdant Tide's amp creates a second one.
    expectFabToken(game, "embodiment-of-earth").toHaveCount(2);

    Briar.play(chorusOfRotwoodRed);
    game.untilIdle({ optionals: "decline" }); // decline Decompose

    // The turn-long replacement remains active: printed 3 Runechants plus 1.
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 4);
  });

  it("boundary: without an Earth pitch there is no Embodiment (amp still applies)", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [verdantTideRed, chorusOfRotwoodRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: padding,
      },
      { hero: dash, hand: [], deck: padding },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(verdantTideRed);
    game.untilIdle();

    expectFabToken(game, "embodiment-of-earth").toHaveCount(0);

    Briar.play(chorusOfRotwoodRed);
    game.untilIdle({ optionals: "decline" });
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 4);
  });
});
