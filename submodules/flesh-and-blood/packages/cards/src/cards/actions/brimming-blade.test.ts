import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { nimblismBlue } from "./nimblism.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { brimmingBladeRed } from "./brimming-blade.ts";

/**
 * Brimming Blade, Red (AHA011) — Warrior Action. Go again.
 *
 * Printed: Sharpen target sword you control twice.
 * CR 8.5.58: the +1{p} counters (both of them) are removed at the beginning
 * of the end phase, and the sharpened marker expires with them
 * (engine/sharpen-end-of-turn-counter-removal).
 */

describe("Brimming Blade (AHA011) AAA", () => {
  it("happy: sharpening twice puts two +1{p} counters on the sword and its swing hits for 5", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [brimmingBladeRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.play(brimmingBladeRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    expectFabCard(Hala, zenithBlade).toHaveCounters(2);

    Hala.activate(zenithBlade);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(5); // 3 base + two +1{p}
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: the end phase removes both counters — the next-turn swing is 3 again", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [brimmingBladeRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.play(brimmingBladeRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    expectFabCard(Hala, zenithBlade).toHaveCounters(2);

    Hala.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Hala, zenithBlade).toHaveCounters(0);

    Hala.activate(zenithBlade, {});
    Hala.pitchFirst();
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(3); // CR 8.5.58 expiry
    game.helpers.resolveRestOfCombat();
  });
});
