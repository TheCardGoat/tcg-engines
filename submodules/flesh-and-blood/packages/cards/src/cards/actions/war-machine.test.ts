import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { prowlBlue } from "./prowl.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { evoCircuitBreakerRed } from "../instants/evo-circuit-breaker.ts";
import { evoAtomBreakerRed } from "../instants/evo-atom-breaker.ts";
import { evoFaceBreakerRed } from "../instants/evo-face-breaker.ts";
import { evoMachBreakerRed } from "../instants/evo-mach-breaker.ts";
import { warMachineRed } from "./war-machine.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("War Machine (EVO056) AAA", () => {
  it("without Evos costs 6 and leaves the defending arsenal intact", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [warMachineRed], resourcePoints: 6, deck: 6 },
      { hero: bravo, arsenal: [prowlBlue], life: 20, deck: 6 },
      manual,
    );
    game.as(dash).attackWith(warMachineRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(bravo).zone("arsenal")).toContain(prowlBlue.canonicalId);
  });

  it("with four Evos attacks for 9 with overpower and destroys arsenal on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [evoCircuitBreakerRed],
        chest: [evoAtomBreakerRed],
        arms: [evoFaceBreakerRed],
        legs: [evoMachBreakerRed],
        hand: [warMachineRed],
        resourcePoints: 6,
        deck: 6,
      },
      { hero: bravo, arsenal: [prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Dash = game.as(dash);
    Dash.attackWith(warMachineRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(9);
    expect(game.combat()?.activeLink?.keywords).toContain("overpower");
    game.helpers.resolveRestOfCombat();
    expect(game.as(bravo).zone("arsenal")).toHaveLength(0);
    expect(game.as(bravo).zone("graveyard")).toContain(prowlBlue.canonicalId);
  });

  it("with two Evos costs 3 before payment, keeps its one-Evo hit effect, and has no three-or-four-Evo bonuses", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [evoCircuitBreakerRed],
        chest: [evoAtomBreakerRed],
        hand: [warMachineRed],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: bravo, arsenal: [prowlBlue], life: 20, deck: 6 },
      manual,
    );
    game.as(dash).attackWith(warMachineRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    expect(game.combat()?.activeLink?.keywords).not.toContain("overpower");
    game.helpers.resolveRestOfCombat();
    expect(game.as(bravo).zone("arsenal")).toHaveLength(0);
  });
});
