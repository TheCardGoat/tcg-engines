import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { ironrotPlate } from "../equipment/ironrot-plate.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { poppedCollarPolo } from "../equipment/popped-collar-polo.ts";
import { weaveEarthRed } from "../actions/weave-earth.ts";
import { weaveIceRed } from "../actions/weave-ice.ts";
import { exposedToTheElementsBlue } from "./exposed-to-the-elements.ts";

/**
 * Exposed to the Elements Blue (ELE093) — Elemental Instant, Earth/Ice fusion.
 *
 * Printed: If fused with Earth, put a −1{d} counter on target equipment.
 * If fused with Ice, destroy an equipment with 0{d} they control unless they
 * pay {r}{r}.
 */

describe("Exposed to the Elements (ELE093) AAA", () => {
  it("happy: Earth fusion puts a −1{d} counter on opposing equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [exposedToTheElementsBlue, weaveEarthRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], chest: [ironrotPlate], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.play(exposedToTheElementsBlue, {
      fuse: true,
      fuseCards: [weaveEarthRed],
    });
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: ironrotPlate.canonicalId,
    });

    expectFabCard(Dash, ironrotPlate).toHaveDefenseCounters(-1);
    expectFabCard(Oldhim, exposedToTheElementsBlue).toBeIn("graveyard");
  });

  it("boundary: unfused, the equipment keeps its printed defense counters", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [exposedToTheElementsBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], chest: [ironrotPlate], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.play(exposedToTheElementsBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, ironrotPlate).toHaveDefenseCounters(0);
    expectFabCard(Oldhim, exposedToTheElementsBlue).toBeIn("graveyard");
  });

  it("timing: Ice-only fusion does not put the Earth −1{d} counter", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [exposedToTheElementsBlue, weaveIceRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], chest: [ironrotPlate], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.play(exposedToTheElementsBlue, { fuse: true, fuseCards: [weaveIceRed] });
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Dash, ironrotPlate).toHaveDefenseCounters(0);
    expectFabCard(Oldhim, exposedToTheElementsBlue).toBeIn("graveyard");
  });

  it("happy: Ice fusion destroys 0{d} equipment controlled by the targeted hero", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [exposedToTheElementsBlue, weaveIceRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], chest: [poppedCollarPolo], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.play(exposedToTheElementsBlue, {
      target: Dash.id,
      fuse: true,
      fuseCards: [weaveIceRed],
    });
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Dash, poppedCollarPolo).toBeIn("graveyard");
  });
});
