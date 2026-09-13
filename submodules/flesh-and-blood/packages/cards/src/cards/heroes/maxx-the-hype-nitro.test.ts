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
import { maxxTheHypeNitro } from "./maxx-the-hype-nitro.ts";

/**
 * Maxx 'The Hype' Nitro (EVO004) — Mechanologist Hero.
 *
 * Printed: Once per Turn Action - {r}{r}: Create a Hyper Driver token with
 * 2 steam counters. Activate this ability only if you've boosted this turn.
 */

describe("Maxx the Hype Nitro (EVO004) AAA", () => {
  it("happy: after boosting this turn, paying {r}{r} creates a Hyper Driver", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxTheHypeNitro,
        hand: [throttleRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Maxx = game.as(maxxTheHypeNitro);

    Maxx.play(throttleRed, { boost: true });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    Maxx.activate(maxxTheHypeNitro);
    game.passBoth();

    expectFabPlayer(Maxx).toHaveTokenCount("hyper-driver", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("hyper-driver", 0);
    // The token entered with 2 steam counters and gets crank from the hero.
    const driver = Maxx.cardIn("arena", fabToken("hyper-driver"));
    expectFabCard(Maxx, driver).toHaveCounters(2, "steam").toHaveKeyword("crank");
  });

  it("boundary: cannot activate without boosting this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxTheHypeNitro,
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Maxx = game.as(maxxTheHypeNitro);

    Maxx.expectActivationRejected(maxxTheHypeNitro);
    expectFabPlayer(Maxx).toHaveTokenCount("hyper-driver", 0);
  });

  it("boundary: once per turn — a second activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxTheHypeNitro,
        hand: [throttleRed],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Maxx = game.as(maxxTheHypeNitro);

    Maxx.play(throttleRed, { boost: true });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    Maxx.activate(maxxTheHypeNitro);
    game.passBoth();
    expectFabPlayer(Maxx).toHaveTokenCount("hyper-driver", 1);

    Maxx.expectActivationRejected(maxxTheHypeNitro);
    expectFabPlayer(Maxx).toHaveTokenCount("hyper-driver", 1);
  });
});
