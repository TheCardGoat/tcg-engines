import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tekloBaseHead } from "../equipment/teklo-base-head.ts";
import { evoSentryBaseHeadRed } from "../actions/evo-sentry-base-head.ts";
import { evoSteelSoulMemoryBlue } from "../actions/evo-steel-soul-memory.ts";
import { teklovossen } from "./teklovossen.ts";

/**
 * Teklovossen (EVO008) — Mechanologist Hero — Young.
 *
 * Printed: "You may play Evos from your banished zone.
 * Once per Turn Instant — {r}{r}{r}: You may play your next Evo this turn as
 * though it were an instant. When you do, draw a card."
 *
 * Origin (banished Evos) and timing (next Evo as instant) are independent
 * permissions that compose: a banished Evo after the hero instant spends no
 * action point (CR 5.1.1a + 8.1.1d).
 */

describe("Teklovossen (EVO008) AAA", () => {
  it("happy: after the instant, a banished Evo plays as an instant, spends no AP, and draws", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [tekloBaseHead],
        hand: [],
        banished: [evoSentryBaseHeadRed],
        resourcePoints: 5,
        actionPoints: 0,
        deck: [tekloBaseHead],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.activate(teklovossen);
    game.passBoth();
    Teklo.play(evoSentryBaseHeadRed, { from: "banished" });
    game.untilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Teklo).toHaveAP(0);
    expectFabCard(Teklo, evoSentryBaseHeadRed).toBeIn("head");
    expectFabPlayer(Teklo).toHaveHandCount(1);
  });

  it("boundary: without the instant, a banished Evo still costs an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [tekloBaseHead],
        banished: [evoSentryBaseHeadRed],
        resourcePoints: 2,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    expectFabUnplayable(
      () => Teklo.play(evoSentryBaseHeadRed, { from: "banished" }),
      /action-?point cost cannot be paid/i,
    );
    expectFabCard(Teklo, evoSentryBaseHeadRed).toBeBanished();
  });

  it("timing: the next-Evo grant is consumed by the first Evo, so a second banished Evo at 0 AP is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [tekloBaseHead],
        hand: [],
        banished: [evoSentryBaseHeadRed, evoSteelSoulMemoryBlue],
        resourcePoints: 5,
        actionPoints: 0,
        deck: [tekloBaseHead],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.activate(teklovossen);
    game.passBoth();
    Teklo.play(evoSentryBaseHeadRed, { from: "banished" });
    game.untilIdle({ entityTargets: "minimum" });

    expectFabUnplayable(
      () => Teklo.play(evoSteelSoulMemoryBlue, { from: "banished" }),
      /action-?point cost cannot be paid/i,
    );
    expectFabCard(Teklo, evoSteelSoulMemoryBlue).toBeBanished();
  });

  it("boundary: a non-Evo cannot be played from the banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        banished: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    expectFabUnplayable(() => Teklo.play(snatchRed, { from: "banished" }), /banished/i);
    expectFabCard(Teklo, snatchRed).toBeBanished();
  });
});
