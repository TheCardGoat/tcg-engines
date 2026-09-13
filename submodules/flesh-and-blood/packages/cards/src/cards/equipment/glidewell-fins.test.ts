import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { endlessArrowRed } from "../actions/endless-arrow.ts";
import { snatchRed } from "../actions/snatch.ts";
import { farflightLongbow } from "../weapons/farflight-longbow.ts";
import { glidewellFins } from "./glidewell-fins.ts";

/**
 * Glidewell Fins — Ranger Equipment - Arms, d1 Battleworn.
 *
 * Printed: "Action - {r}, destroy this: Put an arrow from your hand face-up
 * into your arsenal. It gets +1{p} this turn. Go again"
 */

describe("Glidewell Fins (SEA097) AAA", () => {
  it("happy: store an arrow face-up in the arsenal and swing it at +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arms: [glidewellFins],
        weapon1: [farflightLongbow],
        hand: [endlessArrowRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(glidewellFins);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Azalea, glidewellFins).toBeIn("graveyard");
    expectFabCard(Azalea, endlessArrowRed).toBeIn("arsenal").toBeFaceUp();

    // Endless Arrow 4{p} + 1 (this-turn buff rides the stored arrow).
    Azalea.playFromArsenal(endlessArrowRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    game.as(dash).defendWith();
    game.helpers.resolveRestOfCombat();
  });

  it("boundary: the arsenal must be empty — a filled arsenal blocks the activation", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arms: [glidewellFins],
        hand: [endlessArrowRed],
        arsenal: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.expectActivationRejected(glidewellFins);
    expectFabCard(Azalea, glidewellFins).toBeIn("arms");
    expectFabCard(Azalea, endlessArrowRed).toBeIn("hand");
  });
});
