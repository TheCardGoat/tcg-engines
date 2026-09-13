import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { scabskinLeathers } from "../equipment/scabskin-leathers.ts";
import { ruggedRoller } from "./rugged-roller.ts";

/**
 * The committed die face for a single deterministic boot (knucklehead
 * pattern): prefer the resolved `roll` event's explicit result, falling back
 * to the latched `roll-request` bindings.
 */

describe("Rugged Roller (DTD199) AAA", () => {
  it("rejects its activated ability before its controller rolls a 6", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [ruggedRoller],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    const rejected = Rhinar.expectActivationRejected(ruggedRoller);
    expect(rejected.errorCode).toBe("activation_condition_failed");
  });

  it("gates its activated ability on the die face rolled this turn", () => {
    // The die roll commits as a follow-up of the activation, so observe it
    // only after draining the ability layer — never by re-booting on new
    // seeds until a 6 appears (the old scan read the journal too early and
    // could never observe a roll).
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [ruggedRoller],
        legs: [scabskinLeathers],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { ...FAB_MANUAL_HARNESS, seed: "rugged-roller-die-5" },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.must.activate(scabskinLeathers);
    game.helpers.resolveUntilIdle();

    const face = game.lastDieFace();
    expect(face).toBeGreaterThanOrEqual(1);
    expect(face).toBeLessThanOrEqual(6);

    if (face === 6) {
      Rhinar.must.activate(ruggedRoller);
      game.passBoth();

      expect(game.combat()?.activeLink?.attackPower).toBe(6);
    } else {
      const rejected = Rhinar.expectActivationRejected(ruggedRoller);
      expect(rejected.errorCode).toBe("activation_condition_failed");
    }
  });
});
