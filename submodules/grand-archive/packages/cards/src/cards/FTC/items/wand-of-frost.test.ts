import { describe } from "vitest";
import { wandOfFrost } from "./wand-of-frost.ts";
import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
/** @covers n0wpbhigka-a1 */
describe("wandOfFrost — Class Bonus entry draw", () => {
  proveOnEnterDraw({
    card: wandOfFrost,
    abilityId: "n0wpbhigka-a1",
    cost: { kind: "memory", amount: 1 },
    destination: "hand",
    classBonus: true,
  });
});

import { proveTargetAttackReduction } from "../../../testing/target-attack-reduction.ts";
/** @covers n0wpbhigka-a2 */
describe("wandOfFrost attack reduction", () => {
  proveTargetAttackReduction(wandOfFrost, "banish", "n0wpbhigka-a2");
});
