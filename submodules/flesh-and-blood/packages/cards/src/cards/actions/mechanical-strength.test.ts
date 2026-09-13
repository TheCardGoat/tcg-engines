import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { evoCircuitBreakerRed } from "../instants/evo-circuit-breaker.ts";
import { evoAtomBreakerRed } from "../instants/evo-atom-breaker.ts";
import { professorTeklovossen } from "../heroes/professor-teklovossen.ts";
import { mechanicalStrengthRed } from "./mechanical-strength.ts";

/**
 * Mechanical Strength (TCC013) — Mechanologist Action - Attack,
 * cost 3, 5{p}, 3{d}.
 * Printed: "Evo Upgrade — This gets +X{p}, where X is the number of Evos
 * you have equipped."
 *
 * `evos-equipped` count is runtime (CR 8.4.11). Seat Teklovossen so Dash
 * start-game item placement cannot interfere.
 */

describe("Mechanical Strength (TCC013) AAA", () => {
  it("happy: one equipped Evo grants +1{p} (6 total)", () => {
    const game = FabTestEngine.start(
      {
        hero: professorTeklovossen,
        hand: [mechanicalStrengthRed],
        head: [evoCircuitBreakerRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(professorTeklovossen).playAttack(mechanicalStrengthRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: with no Evos equipped, the attack stays at printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: professorTeklovossen,
        hand: [mechanicalStrengthRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(professorTeklovossen).playAttack(mechanicalStrengthRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
  });

  it("interaction: two equipped Evos grant +2{p} (7 total)", () => {
    const game = FabTestEngine.start(
      {
        hero: professorTeklovossen,
        hand: [mechanicalStrengthRed],
        head: [evoCircuitBreakerRed],
        chest: [evoAtomBreakerRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(professorTeklovossen).playAttack(mechanicalStrengthRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
  });
});
