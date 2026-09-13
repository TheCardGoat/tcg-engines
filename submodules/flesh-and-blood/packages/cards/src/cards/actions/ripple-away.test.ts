import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { envelopInDarknessRed } from "./envelop-in-darkness.ts";
import { rippleAwayBlue } from "./ripple-away.ts";

/**
 * Ripple Away Blue (HVY209) — Instant discard this: action-card creates get
 * that many minus 1 of each token type this turn.
 */

describe("Ripple Away (HVY209) AAA", () => {
  it("happy: discard this so an action that would create 1 Runechant instead creates 0", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [rippleAwayBlue, envelopInDarknessRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.activate(rippleAwayBlue);
    game.helpers.resolveUntilIdle();
    expect(Vynnset.zone("hand")).not.toContain(rippleAwayBlue.canonicalId);

    Vynnset.play(envelopInDarknessRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 0);
  });

  it("boundary: without Ripple Away, Envelop in Darkness still creates 1 Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [envelopInDarknessRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(envelopInDarknessRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 1);
  });
});
