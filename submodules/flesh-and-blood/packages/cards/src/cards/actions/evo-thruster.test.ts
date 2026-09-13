import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBlaster } from "../weapons/teklo-blaster.ts";
import { tekloBaseLegs } from "../equipment/teklo-base-legs.ts";
import { evoThrusterYellow } from "./evo-thruster.ts";

/**
 * Evo Thruster (EVO037) — Mechanologist Action Evo Legs d3.
 *
 * Printed: If you have a base legs equipped, transform it into this, then
 * equip this.
 */

describe("Evo Thruster (EVO037) AAA", () => {
  it("happy: with a base legs equipped, this transforms into the legs slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        legs: [tekloBaseLegs],
        hand: [evoThrusterYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    Teklo.play(evoThrusterYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoThrusterYellow).toBeIn("legs");
    expect(Teklo.zone("legs")).not.toContain(tekloBaseLegs.canonicalId);
  });

  it("boundary: Instant destroy-under-this is unpayable with no card under this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        legs: [evoThrusterYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(teklovossen).expectActivationRejected(evoThrusterYellow);
  });

  it("timing: without paying destroy-under-this the once-per-turn weapon stays limited", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        legs: [evoThrusterYellow],
        weapon1: [tekloBlaster],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    Teklo.activateAttack(tekloBlaster);
    game.closeCombat({ optionals: "decline" });
    Teklo.expectActivationRejected(tekloBlaster);
  });
});
