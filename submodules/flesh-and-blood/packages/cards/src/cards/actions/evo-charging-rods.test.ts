import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBaseLegs } from "../equipment/teklo-base-legs.ts";
import { evoChargingRodsYellow } from "./evo-charging-rods.ts";

/**
 * Evo Charging Rods (EVO049) — Mechanologist Action Evo Legs d2.
 *
 * Printed: If you have a base legs equipped, transform it into this, then
 * equip this.
 */

describe("Evo Charging Rods (EVO049) AAA", () => {
  it("happy: with a base legs equipped, this transforms into the legs slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        legs: [tekloBaseLegs],
        hand: [evoChargingRodsYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    Teklo.play(evoChargingRodsYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoChargingRodsYellow).toBeIn("legs");
    expect(Teklo.zone("legs")).not.toContain(tekloBaseLegs.canonicalId);
  });

  it("boundary: Instant destroy-under-this is unpayable with no card under this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        legs: [evoChargingRodsYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(teklovossen).expectActivationRejected(evoChargingRodsYellow);
  });

  it("timing: without paying destroy-under-this no Quicken is created", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        legs: [evoChargingRodsYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    Teklo.expectActivationRejected(evoChargingRodsYellow);
    expect(Teklo.zone("arena")).not.toContain("token:quicken");
  });
});
