import { describe } from "vitest";
import { clericRobes } from "./cleric-robes.ts";
import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
/** @covers pv4n1n3gyg-a1 */
describe("clericRobes — Class Bonus entry draw", () => {
  proveOnEnterDraw({
    card: clericRobes,
    abilityId: "pv4n1n3gyg-a1",
    cost: { kind: "memory", amount: 1 },
    destination: "hand",
    classBonus: true,
  });
});
