import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { hyperDriverRed } from "../actions/hyper-driver.ts";
import { tekloBaseChest } from "../equipment/teklo-base-chest.ts";
import { evoAtomBreakerRed } from "./evo-atom-breaker.ts";

/**
 * Evo Atom Breaker (EVO031) — Mechanologist Instant Evo Chest.
 * Printed: If you have a base chest equipped, transform it and X Hyper Drivers
 * you control into this, then equip this.
 */

describe("Evo Atom Breaker (EVO031) AAA", () => {
  it("happy: with a base chest equipped this transforms into the chest slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        chest: [tekloBaseChest],
        arena: [hyperDriverRed],
        hand: [evoAtomBreakerRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoAtomBreakerRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoAtomBreakerRed).toBeIn("graveyard");
    expect(Teklo.zone("chest")).not.toContain(evoAtomBreakerRed.canonicalId);
  });

  it("boundary: without a base chest equipped this does not enter the chest slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [evoAtomBreakerRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoAtomBreakerRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Teklo.zone("chest")).not.toContain(evoAtomBreakerRed.canonicalId);
  });
});
