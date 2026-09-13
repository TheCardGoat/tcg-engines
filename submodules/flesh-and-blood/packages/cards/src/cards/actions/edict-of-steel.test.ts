import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { edictOfSteelRed } from "./edict-of-steel.ts";

/**
 * Edict of Steel Red (AHA012) — Warrior Action. Go again.
 *
 * Printed: Sharpen target sword you control.
 * If it has 1 or more +1{p} counters, create a Flurry token.
 */

describe("edict-of-steel family AAA", () => {
  it("happy: the sharpen lands and the counter arms a Flurry token", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [edictOfSteelRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.play(edictOfSteelRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });

    // The sword now carries 1 +1{p} counter and the Flurry rider fired:
    // "it" is bound by the sharpen step, so the counter check sees it.
    expectFabCard(Hala, zenithBlade).toHaveCounters(1);
    expectFabPlayer(Hala).toHaveTokenCount("flurry", 1);
    expectFabPlayer(Hala).toHaveAP(1); // go again
  });
});
