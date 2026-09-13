import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  fabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { throttleRed } from "../actions/throttle.ts";
import { dash } from "./dash.ts";
import { banksy } from "../weapons/banksy.ts";
import { snatchRed } from "../actions/snatch.ts";
import { maxxNitro } from "./maxx-nitro.ts";

/**
 * Maxx Nitro (EVO005) — Mechanologist Hero — Young.
 *
 * Printed: "Once per Turn Action - {r}{r}: Create a Hyper Driver token with
 * 2 steam counters. Activate this only if you've boosted this turn.
 * Hyper Drivers you control get crank."
 *
 * Signature weapon: Banksy (EVO006).
 *
 * Pattern mirrors maxx-the-hype-nitro.test.ts (adult EVO004) with young stats.
 */

describe("Maxx Nitro (EVO005) AAA", () => {
  it("happy: after boosting this turn, {r}{r} creates a Hyper Driver with 2 steam counters and crank", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        hand: [throttleRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Maxx = game.as(maxxNitro);

    // Boost is an optional cost — elect it to satisfy the activation condition.
    Maxx.play(throttleRed, { boost: true });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    Maxx.activate(maxxNitro);
    game.passBoth();

    // {r}{r} paid (4 − 2 throttle − 2 activation), token under Maxx's control.
    expectFabPlayer(Maxx).toHaveResourceCount(0);
    expectFabPlayer(Maxx).toHaveTokenCount("hyper-driver", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("hyper-driver", 0);
    // The token entered with 2 steam counters and gets crank from the hero.
    const driver = Maxx.cardIn("arena", fabToken("hyper-driver"));
    expectFabCard(Maxx, driver).toHaveCounters(2, "steam").toHaveKeyword("crank");
  });

  it("boundary: cannot activate without boosting this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Maxx = game.as(maxxNitro);

    Maxx.expectActivationRejected(maxxNitro);
    expectFabPlayer(Maxx).toHaveTokenCount("hyper-driver", 0);
  });

  it("boundary: once per turn — a second activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        hand: [throttleRed],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Maxx = game.as(maxxNitro);

    Maxx.play(throttleRed, { boost: true });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    Maxx.activate(maxxNitro);
    game.passBoth();
    expectFabPlayer(Maxx).toHaveTokenCount("hyper-driver", 1);

    Maxx.expectActivationRejected(maxxNitro);
    expectFabPlayer(Maxx).toHaveTokenCount("hyper-driver", 1);
  });

  it("boundary: Banksy (EVO006) cannot attack without having cranked this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        weapon1: [banksy],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Maxx = game.as(maxxNitro);

    // No crank this turn — Banksy's once-per-turn attack is illegal.
    Maxx.expectActivationRejected(banksy);
  });
});
