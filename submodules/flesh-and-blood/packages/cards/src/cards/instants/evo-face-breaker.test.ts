import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { hyperDriverRed } from "../actions/hyper-driver.ts";
import { tekloBaseArms } from "../equipment/teklo-base-arms.ts";
import { evoFaceBreakerRed } from "./evo-face-breaker.ts";

/**
 * Evo Face Breaker (EVO032) — Mechanologist Instant Evo Arms.
 * Printed: If you have a base arms equipped, transform it and X Hyper Drivers
 * you control into this, then equip this.
 */

describe("Evo Face Breaker (EVO032) AAA", () => {
  it("happy: with a base arms equipped this transforms into the arms slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arms: [tekloBaseArms],
        arena: [hyperDriverRed],
        hand: [evoFaceBreakerRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoFaceBreakerRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoFaceBreakerRed).toBeIn("graveyard");
    expect(Teklo.zone("arms")).not.toContain(evoFaceBreakerRed.canonicalId);
  });

  it("boundary: without a base arms equipped this does not enter the arms slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [evoFaceBreakerRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoFaceBreakerRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Teklo.zone("arms")).not.toContain(evoFaceBreakerRed.canonicalId);
  });
});
