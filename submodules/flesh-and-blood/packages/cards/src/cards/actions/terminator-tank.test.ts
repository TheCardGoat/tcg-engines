import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { prowlBlue } from "./prowl.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { evoCircuitBreakerRed } from "../instants/evo-circuit-breaker.ts";
import { evoAtomBreakerRed } from "../instants/evo-atom-breaker.ts";
import { evoFaceBreakerRed } from "../instants/evo-face-breaker.ts";
import { evoMachBreakerRed } from "../instants/evo-mach-breaker.ts";
import { terminatorTankRed } from "./terminator-tank.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Terminator Tank (EVO055) AAA", () => {
  it("without Evos costs 6, attacks for 6, and grants no discard trigger", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [terminatorTankRed], resourcePoints: 6, deck: 6 },
      { hero: bravo, hand: [prowlBlue], life: 20, deck: 6 },
      manual,
    );
    game.as(dash).attackWith(terminatorTankRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(bravo).life()).toBe(14);
    expect(game.as(bravo).zone("hand")).toContain(prowlBlue.canonicalId);
  });

  it("with four Evos attacks for 9 with overpower and discards on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [evoCircuitBreakerRed],
        chest: [evoAtomBreakerRed],
        arms: [evoFaceBreakerRed],
        legs: [evoMachBreakerRed],
        hand: [terminatorTankRed],
        resourcePoints: 6,
        deck: 6,
      },
      { hero: bravo, hand: [prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Dash = game.as(dash);
    Dash.attackWith(terminatorTankRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(9);
    expect(game.combat()?.activeLink?.keywords).toContain("overpower");
    game.helpers.resolveRestOfCombat();
    expect(game.as(bravo).life()).toBe(11);
    expect(game.as(bravo).zone("hand")).toHaveLength(0);
  });

  it("with two Evos costs 3 before payment, keeps its one-Evo hit effect, and has no three-or-four-Evo bonuses", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [evoCircuitBreakerRed],
        chest: [evoAtomBreakerRed],
        hand: [terminatorTankRed],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: bravo, hand: [prowlBlue], life: 20, deck: 6 },
      manual,
    );
    game.as(dash).attackWith(terminatorTankRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    expect(game.combat()?.activeLink?.keywords).not.toContain("overpower");
    game.helpers.resolveRestOfCombat();
    expect(game.as(bravo).life()).toBe(14);
    expect(game.as(bravo).zone("hand")).toHaveLength(0);
  });
});
