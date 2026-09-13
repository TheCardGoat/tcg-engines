import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { hala } from "../heroes/hala.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { sharpNShineRed, sharpNShineYellow } from "./sharp-n-shine.ts";

/**
 * Sharp 'n Shine, Red (MPW123) / Yellow (MPW124) — Warrior Action, cost 0, go
 * again.
 *
 * Printed red: "Sharpen target sword you control. If it has 1 or more +1{p}
 * counters, create a Blade Dance token. Go again"
 * Printed yellow uses a threshold of 2 or more +1{p} counters.
 */

describe("Sharp 'n Shine (MPW123) AAA", () => {
  it("happy: sharpening a fresh sword reaches the red threshold and creates a Blade Dance", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [zenithBlade],
        hand: [sharpNShineRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(hala);

    Hala.play(sharpNShineRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });

    expectFabCard(Hala, zenithBlade).toHaveCounters(1);
    expectFabPlayer(Hala).toHaveTokenCount("blade-dance", 1);
    // Cost 0 with go again: the spent action point is refunded.
    expectFabPlayer(Hala).toHaveAP(1);
  });

  it("boundary: one sharpen counter is below the yellow threshold and creates no token", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [zenithBlade],
        hand: [sharpNShineYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(hala);

    Hala.play(sharpNShineYellow);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });

    expectFabCard(Hala, zenithBlade).toHaveCounters(1);
    expectFabPlayer(Hala).toHaveTokenCount("blade-dance", 0);
  });

  it("timing: a pre-sharpened sword crosses the yellow threshold on the second counter", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [{ card: zenithBlade, state: { powerCounterTotal: 1 } }],
        hand: [sharpNShineYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(hala);

    Hala.play(sharpNShineYellow);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });

    expectFabCard(Hala, zenithBlade).toHaveCounters(2);
    expectFabPlayer(Hala).toHaveTokenCount("blade-dance", 1);
  });
});
