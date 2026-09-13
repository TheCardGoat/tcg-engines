import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { evoCircuitBreakerRed } from "../instants/evo-circuit-breaker.ts";
import { evoAtomBreakerRed } from "../instants/evo-atom-breaker.ts";
import { evoFaceBreakerRed } from "../instants/evo-face-breaker.ts";
import { evoMachBreakerRed } from "../instants/evo-mach-breaker.ts";
import { tekloLeveler } from "./teklo-leveler.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Teklo Leveler (EVO009) AAA", () => {
  it("has no attack activation without an Evo equipped", () => {
    const game = FabTestEngine.start(
      { hero: dash, weapon1: [tekloLeveler], resourcePoints: 3, deck: 6 },
      { hero: bravo, deck: 6 },
      manual,
    );
    game.as(dash).expectActivationRejected(tekloLeveler);
  });

  it("with one Evo attacks for 2 and costs 3", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [tekloLeveler],
        head: [evoCircuitBreakerRed],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: bravo, life: 20, deck: 6 },
      manual,
    );
    const Dash = game.as(dash);
    Dash.activate(tekloLeveler);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
    game.helpers.resolveRestOfCombat();
    expect(Dash.actionPoints()).toBe(0);
  });

  it("with two Evos costs 1; with three gains go again; with four attacks for 3", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [tekloLeveler],
        head: [evoCircuitBreakerRed],
        chest: [evoAtomBreakerRed],
        arms: [evoFaceBreakerRed],
        legs: [evoMachBreakerRed],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 20, deck: 6 },
      manual,
    );
    const Dash = game.as(dash);
    Dash.activate(tekloLeveler);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    game.helpers.resolveRestOfCombat();
    expect(game.as(bravo).life()).toBe(17);
    expect(Dash.actionPoints()).toBe(1);
  });
});
