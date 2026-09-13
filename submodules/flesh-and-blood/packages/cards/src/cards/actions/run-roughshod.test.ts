import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { kayoBerserkerRunt } from "../heroes/kayo-berserker-runt.ts";
import { writhingBeastHulkRed } from "./writhing-beast-hulk.ts";
import { primevalBellowRed } from "./primeval-bellow.ts";
import { runRoughshodBlue } from "./run-roughshod.ts";

/**
 * Action behavior acceptance test — Run Roughshod, Blue (AKO024).
 *
 * AAA trio:
 * - Happy: playable when discarded-a-card-with-6-or-more-p-this-turn status is set
 * - Boundary: not playable without the discard status
 * - Timing: restriction is per-play (gated by has-status)
 *
 * Hero: Kayo, Berserker Runt (CRU002) — Brute/Young
 * FLUENT API ONLY.
 *
 */

describe("Run Roughshod, Blue (AKO024) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: card plays successfully after discarding a 6+ power card this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoBerserkerRunt,
        hand: [primevalBellowRed, writhingBeastHulkRed],
        arsenal: [{ card: runRoughshodBlue }],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, life: 20, deck: 6 },
    );
    const Kayo = game.as(kayoBerserkerRunt);

    Kayo.play(primevalBellowRed);
    game.helpers.resolveUntilIdle();
    Kayo.play(runRoughshodBlue, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(7);
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: not playable without discarding 6+ power this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoBerserkerRunt,
        hand: [runRoughshodBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 20, deck: 6 },
    );
    const Kayo = game.as(kayoBerserkerRunt);

    // No card with 6+ power discarded this turn — play should fail.
    expectFabUnplayable(
      () => Kayo.playAttack(runRoughshodBlue),
      /play condition is not satisfied/i,
    );
    expectFabCard(Kayo, runRoughshodBlue).toBeIn("hand");
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: restriction gates each play independently", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoBerserkerRunt,
        hand: [runRoughshodBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 20, deck: 6 },
    );
    const Kayo = game.as(kayoBerserkerRunt);

    // Cannot play without the status.
    expectFabUnplayable(
      () => Kayo.playAttack(runRoughshodBlue),
      /play condition is not satisfied/i,
    );

    // End turn — restriction resets on new turn (status cleared).
    Kayo.endTurn();
    game.as(bravo).endTurn();

    // Still cannot play on next turn without discarding 6+ power.
    expectFabUnplayable(
      () => Kayo.playAttack(runRoughshodBlue),
      /play condition is not satisfied/i,
    );
  });
});
