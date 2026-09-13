import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { evoCircuitBreakerRed } from "../instants/evo-circuit-breaker.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { apocalypseAutomatonRed } from "./apocalypse-automaton.ts";

/**
 * Apocalypse Automaton (TCC011) — Mechanologist Attack, cost 3, 6{p}.
 *
 * Printed: Play this only if you have 1 or more Evos equipped.
 * This attacks up to X target opposing heroes, where X is the number of
 * Evos you have equipped. 1v1: X opposing heroes is at most one seat.
 */

describe("Apocalypse Automaton (TCC011) AAA", () => {
  it("happy: with an Evo equipped this attacks the opposing hero for 6", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [evoCircuitBreakerRed],
        hand: [apocalypseAutomatonRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(apocalypseAutomatonRed);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: with no Evo equipped this is unplayable", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [apocalypseAutomatonRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    expectFabUnplayable(() => Teklo.playAttack(apocalypseAutomatonRed), /play condition/);
  });

  it("timing: in 1v1 the attack still opens combat against the sole opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [evoCircuitBreakerRed],
        hand: [apocalypseAutomatonRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(apocalypseAutomatonRed);
    expectCombat(game).toBeAtStep("defend");
    expectCombat(game).toHaveAttackPower(6);
  });
});
