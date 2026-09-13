import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { hyperDriver } from "../tokens/hyper-driver.ts";
import { systemFailureYellow } from "./system-failure.ts";

/**
 * System Failure (EVO144) — Mechanologist Action, cost 1, 2{d}.
 *
 * Printed: Remove all steam counters from target equipment, item, or weapon.
 * If 2 or more steam counters are removed this way, deal 2 damage to its
 * controller.
 *
 * Seat Teklovossen (not Dash) so the real Hyper Driver token is available as
 * the steam-counter target.
 */

describe("System Failure (EVO144) AAA", () => {
  it("happy: removing 2 steam counters deals 2 damage to the controller", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [systemFailureYellow],
        arena: [{ card: hyperDriver, state: { steamCounters: 2 } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(systemFailureYellow, {
      targetInstanceId: Teklo.findCardInZone("arena", hyperDriver),
    });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Teklo).toHaveLife(18);
    expectFabCard(Teklo, systemFailureYellow).toBeIn("graveyard");
  });

  it("boundary: removing 1 steam counter deals no damage", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [systemFailureYellow],
        arena: [{ card: hyperDriver, state: { steamCounters: 1 } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(systemFailureYellow, {
      targetInstanceId: Teklo.findCardInZone("arena", hyperDriver),
    });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Teklo, systemFailureYellow).toBeIn("graveyard");
    expectFabPlayer(Teklo).toHaveLife(20);
  });

  it("timing: with no steam source the card stays in hand and deals no damage", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [systemFailureYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    expectFabUnplayable(() => Teklo.play(systemFailureYellow));
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Teklo, systemFailureYellow).toBeIn("hand");
    expectFabPlayer(Teklo).toHaveLife(20);
    expectFabPlayer(game.as(bravo)).toHaveLife(20);
  });
});
