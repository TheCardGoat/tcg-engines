import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { evoCircuitBreakerRed } from "../instants/evo-circuit-breaker.ts";
import { evoAtomBreakerRed } from "../instants/evo-atom-breaker.ts";
import { professorTeklovossen } from "../heroes/professor-teklovossen.ts";
import { liquidCooledMayhemRed } from "./liquid-cooled-mayhem.ts";

/**
 * Liquid Cooled Mayhem (TCC012) — "This costs {r} less to play for each Evo
 * you have equipped." Cost 4, 6{p}.
 */

describe("Liquid Cooled Mayhem (TCC012) AAA", () => {
  it("happy: one equipped Evo reduces the 4{r} cost to 3", () => {
    const game = FabTestEngine.start(
      {
        hero: professorTeklovossen,
        hand: [liquidCooledMayhemRed],
        head: [evoCircuitBreakerRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(professorTeklovossen);

    Teklo.playAttack(liquidCooledMayhemRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(6);
    expectFabPlayer(Teklo).toHaveResourceCount(0);
  });

  it("boundary: with no Evos, 3{r} cannot pay the printed 4{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: professorTeklovossen,
        hand: [liquidCooledMayhemRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(professorTeklovossen);

    expect(() => Teklo.playAttack(liquidCooledMayhemRed)).toThrow();
    expectFabPlayer(Teklo).toHaveResourceCount(3);
  });

  it("timing: two Evos reduce the cost to 2; opponent Evos do not count", () => {
    const game = FabTestEngine.start(
      {
        hero: professorTeklovossen,
        hand: [liquidCooledMayhemRed],
        head: [evoCircuitBreakerRed],
        chest: [evoAtomBreakerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: fai, hand: [], head: [evoCircuitBreakerRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(professorTeklovossen);

    Teklo.playAttack(liquidCooledMayhemRed);
    expectFabPlayer(Teklo).toHaveResourceCount(0);
  });
});
