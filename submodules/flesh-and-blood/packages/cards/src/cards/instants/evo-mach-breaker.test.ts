import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { hyperDriverRed } from "../actions/hyper-driver.ts";
import { tekloBaseLegs } from "../equipment/teklo-base-legs.ts";
import { evoMachBreakerRed } from "./evo-mach-breaker.ts";

/**
 * Evo Mach Breaker (EVO033) — Mechanologist Instant Evo Legs.
 * Printed: If you have a base legs equipped, transform it and X Hyper Drivers
 * you control into this, then equip this.
 */

describe("Evo Mach Breaker (EVO033) AAA", () => {
  it("happy: with a base legs equipped this transforms into the legs slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        legs: [tekloBaseLegs],
        arena: [hyperDriverRed],
        hand: [evoMachBreakerRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoMachBreakerRed);
    expect(() =>
      game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" }),
    ).toThrow(/at-resolution target count could not be resolved/);

    expectFabCard(Teklo, evoMachBreakerRed).toBeIn("stack");
    expect(Teklo.zone("legs")).not.toContain(evoMachBreakerRed.canonicalId);
  });

  it("boundary: without a base legs equipped this does not enter the legs slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [evoMachBreakerRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoMachBreakerRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Teklo.zone("legs")).not.toContain(evoMachBreakerRed.canonicalId);
  });
});
