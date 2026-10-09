import { describe } from "vitest";
import { drawnBlade } from "./drawn-blade.ts";
import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
/** @covers eSAIP7mx9z-a1 */
describe("drawnBlade — Class Bonus entry draw", () => {
  proveOnEnterDraw({
    card: drawnBlade,
    abilityId: "eSAIP7mx9z-a1",
    cost: { kind: "memory", amount: 1 },
    destination: "hand",
    classBonus: true,
  });
});
