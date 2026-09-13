import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { sharpInclineRed } from "./sharp-incline.ts";
import { sharpInclineYellow } from "./sharp-incline.ts";

/**
 * Sharp Incline Red (AHA013) — Warrior Action. Go again.
 *
 * Printed: Sharpen target sword you control.
 * If it has 1 or more +1{p} counters, your next attack with it this turn
 * costs {r} less to activate.
 */

describe("Sharp Incline (AHA013) AAA", () => {
  it("boundary: an unsharpened sword's activation spends its full printed {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [sharpInclineRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.activate(zenithBlade);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expect(Hala.resourcePoints()).toBe(1); // the printed {r} left the pool
    expectFabPlayer(game.as(dash)).toHaveLife(17); // 3 base power, no counter
  });

  it("happy: the sharpened sword's next activation costs {r} less", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [sharpInclineRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.play(sharpInclineRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    expectFabCard(Hala, zenithBlade).toHaveCounters(1);
    expect(Hala.resourcePoints()).toBe(2); // a cost-0 play spent nothing

    // The armed latch eats the printed {r}: the swing is free.
    Hala.activate(zenithBlade);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(4); // 3 base + one +1{p}
    game.helpers.resolveRestOfCombat();

    expect(Hala.resourcePoints()).toBe(2);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});

/**
 * Sharp Incline Yellow (AHA018) — Warrior Action. Go again.
 *
 * Printed: Sharpen target sword you control.
 * If it has 2 or more +1{p} counters, your next attack with it this turn
 * costs {r} less to activate.
 */

describe("Sharp Incline (AHA018) AAA", () => {
  it("boundary: one sharpen (below two counters) leaves the full {r} price on the swing", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [sharpInclineYellow],
        resourcePoints: 3,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.play(sharpInclineYellow);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    expectFabCard(Hala, zenithBlade).toHaveCounters(1); // below the threshold

    Hala.activate(zenithBlade);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expect(Hala.resourcePoints()).toBe(2); // no discount: the printed {r} was spent
    expectFabPlayer(game.as(dash)).toHaveLife(16); // 4 power (3 + one counter)
  });

  it("happy: the second sharpen reaches the threshold and the activation goes free", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [sharpInclineYellow, sharpInclineYellow],
        resourcePoints: 2,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.play(sharpInclineYellow);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    expectFabCard(Hala, zenithBlade).toHaveCounters(1); // below threshold

    Hala.play(sharpInclineYellow);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    expectFabCard(Hala, zenithBlade).toHaveCounters(2);

    Hala.activate(zenithBlade);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(5); // 3 base + two +1{p}
    game.helpers.resolveRestOfCombat();

    expect(Hala.resourcePoints()).toBe(2); // the discount ate the printed {r}
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });
});
