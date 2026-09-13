import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { throttleRed } from "./throttle.ts";
import { dash } from "../heroes/dash.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloPounderBlue } from "./teklo-pounder.ts";

/**
 * Teklo Pounder (EVR072) — Mechanologist Action Item.
 *
 * Printed: This enters the arena with 3 steam counters. When this has none,
 * destroy it. Once per turn, when you boost an attack action card, remove a
 * steam counter from this. If you do, the attack gets +2{p}.
 */

describe("Teklo Pounder (EVR072) AAA", () => {
  it("happy: boosting an attack action removes 1 steam and the attack gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [tekloPounderBlue, throttleRed],
        deck: [grindingGearsBlue],
        resourcePoints: 4,
        actionPoints: 2,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(tekloPounderBlue);
    game.untilIdle();
    expectFabCard(Teklo, tekloPounderBlue).toBeIn("arena").toHaveCounters(3, "steam");

    Teklo.attackWith(throttleRed, { boost: true });
    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Teklo, tekloPounderBlue).toBeIn("arena").toHaveCounters(2, "steam");
  });

  it("boundary: boosting is required — an unboosted attack stays printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [tekloPounderBlue, throttleRed],
        deck: [grindingGearsBlue],
        resourcePoints: 4,
        actionPoints: 2,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(tekloPounderBlue);
    game.untilIdle();
    Teklo.attackWith(throttleRed, { boost: false });
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();

    expectFabCard(Teklo, tekloPounderBlue).toBeIn("arena").toHaveCounters(3, "steam");
  });

  it("timing: the item enters with 3 steam before any boost this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [tekloPounderBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(tekloPounderBlue);
    game.untilIdle();

    expectFabCard(Teklo, tekloPounderBlue).toBeIn("arena").toHaveCounters(3, "steam");
  });
});
