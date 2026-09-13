/**
 * TCC034 Colossal Bearing — Guardian Attack with the Tower label (CR 8.4.13).
 *
 * Printed:
 *   If this has 13 or more {p}, it gets "When this hits a hero, destroy an
 *   equipment they control with 1 or less {d}."
 *
 * Reasoning:
 * 1. Tower is a static grant gated on the attack's own power. Previously the
 *    card emitted a dead `has-status: "has-13-or-more-power"` marker that the
 *    engine never computed, so the grant never applied.
 * 2. Rewired to the structured `attack-power` condition (gte 13).
 * 3. Base power 8 → Tower inactive; the granted destroy ability must NOT fire.
 *
 * Status: ✅ rewired to attack-power; inactive at base power 8 (no destroy).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, scabskinLeathers } from "../../../fixtures.ts";
import { colossalBearingRed } from "../../../../../../cards/src/cards/actions/colossal-bearing.ts";

describe("TCC034 Colossal Bearing — Tower (CR 8.4.13)", () => {
  it("rewired to the structured attack-power condition with the tower label", () => {
    const ability = colossalBearingRed.base.abilities?.[0];
    expect(ability?.kind).toBe("static");
    expect(ability?.label).toMatchObject({ name: "tower" });
    expect(ability?.condition).toMatchObject({
      type: "attack-power",
      comparison: { op: "gte", value: 13 },
    });
  });

  it("Tower inactive at base power 8: hits, no equipment destroyed", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [colossalBearingRed], resourcePoints: 5, deck: 6 },
      { hero: dash, life: 20, legs: [scabskinLeathers], deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).attackWith(colossalBearingRed);
    game.helpers.resolveRestOfCombat();

    // Power 8 < 13 → Tower grant inactive → scabskin leathers survive.
    expect(game.as(dash).zone("legs")).toContain(scabskinLeathers.canonicalId);
  });
});
